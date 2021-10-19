# CTFNote migration
## Introduction
This guide is for users of CTFNote v1 who would like to keep their data when
upgrading to CTFNote v2.

Supported commits: between `bc214922` and `11ef1851` (excluded)

Commit `11ef1851` and before are not supported because, due to a bug, database's
data was not saved in a non-volatile directory.

Commits on the `graphql` and `dev` branches are not supported.

The operations are:
- Dump the database
- Upgrade to Postgres 14
- Import the database
- Prepare for CTFNote's migration
- Migrate Hedgedoc

## Dumping the database
First of all, in order to make sure we have the latest version of the data
available, stop every containers and restart only `db` in background.

```sh
docker-compose stop && docker-compose up db -d
```

Then, make a dump of the database with `pg_dumpall`.
```sh
docker-compose exec -u postgres db pg_dumpall -U ctfnote > backup.sql
```

Make sure your backup file looks correct before continuing!


## Upgrade to Postgres 14
The current database is Postgres 13. The easiest way to upgrade is to delete the
database and start again. Once again: make sure your backup file is correct.

Stop the database and remove its volume:
```sh
docker-compose down
docker volume rm ctfnote
```

Then, upgrade CTFNote and go to the `v2.0.0` (or newer) tag:
```sh
git fetch && git rebase
git checkout v2.0.0
```

Build a new image for the database and start it. It will create a new, empty
database:
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


## Import data
First, find the name of your container with:
```sh
docker-compose ps
```

Here, the name is `tmp-db-1`. It depends on the directory in which CTFNote is
installed.
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

There should be a *few* errors. This is because Postgres cannot create the same
database/users/schema twice.


## Prepare for CTFNote migration
There are two actions to do to prepare for CTFNote's migration: change the
database user's password and transfer the tables to a special schema.

You can change the password of the ctfnote user with the following command:
```sh
psql -U ctfnote -d ctfnote <<< "ALTER USER ctfnote WITH PASSWORD 'ctfnote';"
```

CTFNote will migrate data from the `migration` schema automatically. Create a
new schema and put every CTFNote table inside :
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
Hedgedoc now uses its own database. Postgres cannot move data between two
databases easily. The best way is to use `pg_dump` to dump the whole schema and
apply it to a different database.

```sh
database=hedgedoc
pg_dump --username "$POSTGRES_USER" -d "$POSTGRES_USER" -n public \
	| psql --username "$POSTGRES_USER" -d "$database"
```

The following error can safely be ignored because it tries to create the
"public" schema that was already created when starting the container:
> ERROR:  schema "public" already exists

One Hedgedoc tables have been moved, they can be deleted:
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
