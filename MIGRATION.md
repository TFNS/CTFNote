# CTFNote migration
## Introduction
This guide is for users of CTFNote v1 who would like to keep their data when
upgrading to CTFNote v2.

Supported commits: between `bc214922` and `11ef1851` (excluded)

Commit `11ef1851` and before are not supported because, due to a bug, database's
data was not saved in a non-volatile directory.

Commits on the `graphql` and `dev` branches are not supported.


## Preparation
### Enter maintenance mode
Stop every containers, restart only `db` in background.

```sh
docker-compose stop && docker-compose up db -d
```

### Make a dump of the database
This dump is *required* to upgrade to Postgres 14:
```sh
docker-compose exec -u postgres db pg_dumpall -U ctfnote > backup.sql
```

Make sure your backup file looks correct before continuing!


## Upgrade to Postgres 14
### Remove current data volume
Stop the database and remove its volume:
```sh
docker-compose down
docker volume rm ctfnote
```

### Upgrade CTFNote
Upgrade CTFNote and go to the `v2.0.0` tag:
```sh
git fetch && git rebase
git checkout v2.0.0
```

Launch only the database:
```sh
docker-compose up --build db
```

The following message should be printed on your console:
```
Multiple database creation requested: hedgedoc
  Creating user and database 'hedgedoc'
CREATE ROLE
CREATE DATABASE
GRANT
Multiple databases created
```

Stop the container with ctrl-c and start it in background:
```sh
docker-compose up -d db
```

### Import data
Find the name of your container:
```sh
docker-compose ps
```

Here, the name is `tmp-db-1`
```
NAME                COMMAND                  SERVICE             STATUS              PORTS
tmp-db-1            "docker-entrypoint.s…"   db                  running             5432/tcp
```

Copy the SQL file to this container:
```sh
docker cp ./backup.sql tmp-db-1:/backup.sql
```

Join the container with:
```sh
docker-compose exec -u postgres db bash
```

Import the data with:
```sh
psql -U ctfnote -d ctfnote < backup.sql
```

## Prepare for CTFNote migration

### Change ctfnote's password
User `ctfnote`'s password changed between version 1 and 2.
```sh
psql -U ctfnote -d ctfnote <<< "ALTER USER ctfnote WITH PASSWORD 'ctfnote';"
```

Create a new schema and put every CTFNote table inside
```sql
psql --username "$POSTGRES_USER" -d "$POSTGRES_USER" <<EOF
	CREATE SCHEMA migration;
	ALTER TABLE public.config            SET SCHEMA migration;
	ALTER TABLE public.ctf               SET SCHEMA migration;
	ALTER TABLE public.ctf_guests_user   SET SCHEMA migration;
	ALTER TABLE public.session           SET SCHEMA migration;
	ALTER TABLE public.task              SET SCHEMA migration;
	ALTER TABLE public.task_players_user SET SCHEMA migration;
	ALTER TABLE public.user              SET SCHEMA migration;
EOF
```

## Migrate Hedgedoc
### Dump and restore
Use `pg_dump` to dump the whole schema and apply it to a different database.

```sh
database=hedgedoc
pg_dump --username "$POSTGRES_USER" -d "$POSTGRES_USER" -n public \
	| psql --username "$POSTGRES_USER" -d "$database"
```

The following error can safely be ignored:
> ERROR:  schema "public" already exists

### Clean the public schema
Hedgedoc tables have been moved, they can be deleted now.

```sh
psql --username "$POSTGRES_USER" -d "$POSTGRES_USER" <<EOF
	DROP TABLE public."Authors";
	DROP TABLE public."Revisions";
	DROP TABLE public."Notes";
	DROP TABLE public."Temp";
	DROP TABLE public."Users";
	DROP TABLE public."Sessions";
	DROP TABLE public."Sessions";
	DROP TABLE public."SequelizeMeta";
	DROP TYPE  public."enum_Notes_permission";
EOF
```


## Run the new version
The installation is now ready to be upgraded !
Leave the docker (ctrl-d) and run:

```sh
docker-compose up --build
```

Congratulations ! You're all set ! :-)
