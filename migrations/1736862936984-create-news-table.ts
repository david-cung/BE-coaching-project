import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNewsTable1736862936984 implements MigrationInterface {
  name = 'CreateNewsTable1736862936984';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`news\` (\`id\` varchar(36) NOT NULL, \`userId\` varchar(36) NOT NULL, \`content\` text CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NOT NULL, \`title\` varchar(1000) NOT NULL, \`image\` varchar(255) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`news\` ADD CONSTRAINT \`FK_9198b86c4c22bf6852c43f3b44e\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`news\` DROP FOREIGN KEY \`FK_9198b86c4c22bf6852c43f3b44e\``,
    );
    await queryRunner.query(`DROP TABLE \`news\``);
  }
}
