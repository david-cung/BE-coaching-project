import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePostTable1735827334868 implements MigrationInterface {
  name = 'UpdatePostTable1735827334868';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`posts\` ADD \`isDeleted\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`posts\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`posts\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`posts\` CHANGE \`category\` \`category\` varchar(255) NULL DEFAULT 'Uncategorized'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`posts\` CHANGE \`category\` \`category\` varchar(255) NOT NULL DEFAULT 'Uncategorized'`,
    );
    await queryRunner.query(`ALTER TABLE \`posts\` DROP COLUMN \`updatedAt\``);
    await queryRunner.query(`ALTER TABLE \`posts\` DROP COLUMN \`createdAt\``);
    await queryRunner.query(`ALTER TABLE \`posts\` DROP COLUMN \`isDeleted\``);
  }
}
