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

### Make a backup
Keep a backup in case something bad were to happen:
```sh
docker-compose exec -u postgres db pg_dumpall -U ctfnote > backup.sql
```

### Get in the container
Most commands are done within the container, join it with:
```sh
docker-compose exec -u postgres db bash
```

## Prepare for CTFNote migration
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
### Create Hedgedoc database
Postgres will not create a new database if there are already databases.

```sh
database=hedgedoc

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
	CREATE USER $database PASSWORD '$database';
	CREATE DATABASE $database;
	GRANT ALL PRIVILEGES ON DATABASE $database TO $database;
EOSQL
```

### Dump and restore
Use `pg_dump` to dump the whole schema and apply it to a different database.

```sh
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

```sh
git fetch && git rebase
docker-compose up --build
```
