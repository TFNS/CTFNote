import { MigrationInterface, QueryRunner } from "typeorm";

export class SaveFlag1615405149843 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("task");
    if (table.findColumnByName("flag")) {
      return;
    }
    await queryRunner.query(`ALTER TABLE "task" ADD flag text`);  
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN flag`);
  }
}
