-- Creates fake v1 migration schema/tables
CREATE SCHEMA IF NOT EXISTS migration;


-- From: /api/src/migration/1604351582906-CreateDatabase.ts

CREATE TABLE IF NOT EXISTS migration."user"(
	"id" SERIAL NOT NULL,
	"slug" text NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"rights" text array NOT NULL,
	CONSTRAINT "UQ_ac08b39ccb744ea6682c0db1c2d" UNIQUE ("slug"),
	CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS migration."task"(
	"id" SERIAL NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" text,
	"solved" boolean NOT NULL DEFAULT false,
	"padUrl" text NOT NULL,
	"ctfId" integer,
	CONSTRAINT "UQ_7e28b6f481038cc247d976df847" UNIQUE ("ctfId", "slug"),
	CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS migration."ctf"(
	"id" SERIAL NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"weight" double precision,
	"ctfUrl" text,
	"logoUrl" text,
	"ctfTimeUrl" text,
	"format" text,
	"description" text,
	"start" date,
	"finish" date,
	CONSTRAINT "UQ_eaa0cd7d65a5bd07b22a205327d" UNIQUE ("slug"),
	CONSTRAINT "PK_dd96b4bb673395d250d1c3bb056" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS migration."session"(
	"id" SERIAL NOT NULL,
	"userSlug" text NOT NULL,
	"uuid" text NOT NULL,
	"expiresAt" date NOT NULL,
	CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS migration."task_players_user"(
	"taskId" integer NOT NULL,
	"userId" integer NOT NULL,
	CONSTRAINT "PK_a339a92e17f22b8e4dbf7fdc34d" PRIMARY KEY
		("taskId", "userId")
);

CREATE TABLE IF NOT EXISTS migration."ctf_guests_user"(
	"ctfId" integer NOT NULL,
	"userId" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS migration."config"(
	id integer NOT NULL,
	key text NOT NULL,
	value json NOT NULL
);
