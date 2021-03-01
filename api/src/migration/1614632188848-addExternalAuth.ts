import {MigrationInterface, QueryRunner} from "typeorm";

export class addExternalAuth1614632188848 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
    	await queryRunner.query(`ALTER TABLE user ADD COLUMN externalAuth boolean NOT NULL DEFAULT false constraint;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    	await queryRunner.query(`ALTER TABLE user DROP COLUMN externalAuth;`);
    }

}