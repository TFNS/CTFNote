import { MigrationInterface, QueryRunner } from "typeorm";

export class SaveFlag1615405149843 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" ADD flag text`);
    await queryRunner.query(`ALTER TABLE "config" ADD private boolean`);
    await queryRunner.query(`UPDATE config SET private=true WHERE key='md-create-url'`);
    await queryRunner.query(`UPDATE config SET private=true WHERE key='md-show-url'`);
    await queryRunner.query(`UPDATE config SET private=true WHERE key='allow-registration'`);
    await queryRunner.query(`INSERT INTO config (key, value, private) VALUES ('store-flag', 'true', false)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN flag`);
    await queryRunner.query(`ALTER TABLE "config" DROP COLUMN private`);
    await queryRunner.query(`DELETE FROM config WHERE key='store-flag'`);
  }
}
