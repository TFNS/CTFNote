import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateDatabase1604351582906 implements MigrationInterface {
    name = 'CreateDatabase1604351582906'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("user");
        if (table != null) {
          return;
        }
        await queryRunner.query(
          `CREATE TABLE "user" ("id" SERIAL NOT NULL, "slug" text NOT NULL, "username" text NOT NULL, "password" text NOT NULL, "rights" text array NOT NULL, CONSTRAINT "UQ_ac08b39ccb744ea6682c0db1c2d" UNIQUE ("slug"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
          `CREATE TABLE "task" ("id" SERIAL NOT NULL, "slug" text NOT NULL, "title" text NOT NULL, "description" text, "category" text, "solved" boolean NOT NULL DEFAULT false, "padUrl" text NOT NULL, "ctfId" integer, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
          `CREATE TABLE "ctf" ("id" SERIAL NOT NULL, "slug" text NOT NULL, "title" text NOT NULL, "weight" double precision, "ctfUrl" text, "logoUrl" text, "ctfTimeUrl" text, "format" text, "description" text, "credentials" text, "start" TIMESTAMP, "finish" TIMESTAMP, CONSTRAINT "UQ_eaa0cd7d65a5bd07b22a205327d" UNIQUE ("slug"), CONSTRAINT "PK_dd96b4bb673395d250d1c3bb056" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`CREATE TABLE "session" ("id" SERIAL NOT NULL, "userSlug" text NOT NULL, "uuid" text NOT NULL, "expiresAt" date NOT NULL, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task_players_user" ("taskId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_a339a92e17f22b8e4dbf7fdc34d" PRIMARY KEY ("taskId", "userId"))`);
        await queryRunner.query(
          `CREATE TABLE "config" ("id" SERIAL NOT NULL, "key" text NOT NULL, "value" json NOT NULL, CONSTRAINT "UQ_26489c99ddbb4c91631ef5cc791" UNIQUE ("key"), CONSTRAINT "PK_d0ee79a681413d50b0a4f98cf7b" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_7e28b6f481038cc247d976df84" ON "task" ("ctfId", "slug")`);
        await queryRunner.query(`CREATE INDEX "IDX_344584ea16e58334c4baf25fab" ON "task_players_user" ("taskId")`);
        await queryRunner.query(`CREATE TABLE "ctf_guests_user" ("ctfId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_591b8ad1033aa94261f75948c9b" PRIMARY KEY ("ctfId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1fc356c5f6ba10ee718534e883" ON "ctf_guests_user" ("ctfId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7f12bda4d0766d864e9632693f" ON "ctf_guests_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_b73d3bfeb7cdb8e23c1ad9acf56" FOREIGN KEY ("ctfId") REFERENCES "ctf"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_players_user" ADD CONSTRAINT "FK_344584ea16e58334c4baf25fab6" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_players_user" ADD CONSTRAINT "FK_3d63c39f2ccb2bf5cb68df2f9f9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ctf_guests_user" ADD CONSTRAINT "FK_1fc356c5f6ba10ee718534e883f" FOREIGN KEY ("ctfId") REFERENCES "ctf"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ctf_guests_user" ADD CONSTRAINT "FK_7f12bda4d0766d864e9632693fa" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ctf_guests_user" DROP CONSTRAINT "FK_7f12bda4d0766d864e9632693fa"`);
        await queryRunner.query(`ALTER TABLE "ctf_guests_user" DROP CONSTRAINT "FK_1fc356c5f6ba10ee718534e883f"`);
        await queryRunner.query(`ALTER TABLE "task_players_user" DROP CONSTRAINT "FK_3d63c39f2ccb2bf5cb68df2f9f9"`);
        await queryRunner.query(`ALTER TABLE "task_players_user" DROP CONSTRAINT "FK_344584ea16e58334c4baf25fab6"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_b73d3bfeb7cdb8e23c1ad9acf56"`);
        await queryRunner.query(`DROP INDEX "IDX_7f12bda4d0766d864e9632693f"`);
        await queryRunner.query(`DROP INDEX "IDX_1fc356c5f6ba10ee718534e883"`);
        await queryRunner.query(`DROP TABLE "ctf_guests_user"`);
        await queryRunner.query(`DROP INDEX "IDX_3d63c39f2ccb2bf5cb68df2f9f"`);
        await queryRunner.query(`DROP INDEX "IDX_344584ea16e58334c4baf25fab"`);
        await queryRunner.query(`DROP INDEX "IDX_7e28b6f481038cc247d976df84"`);
        await queryRunner.query(`DROP TABLE "task_players_user"`);
        await queryRunner.query(`DROP TABLE "session"`);
        await queryRunner.query(`DROP TABLE "ctf"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "config"`);
    }

}
