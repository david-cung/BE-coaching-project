import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateNewsTable1736780444522 implements MigrationInterface {
  name = 'UpdateNewsTable1736780444522';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`news\` DROP COLUMN \`content\``);
    await queryRunner.query(
      `ALTER TABLE \`news\` ADD \`content\` text CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`news\` DROP COLUMN \`content\``);
    await queryRunner.query(
      `ALTER TABLE \`news\` ADD \`content\` varchar(10000) NOT NULL`,
    );
  }
}
