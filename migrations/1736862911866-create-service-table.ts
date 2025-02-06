import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateServiceTable1736862911866 implements MigrationInterface {
  name = 'CreateServiceTable1736862911866';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`services\` (\`id\` varchar(36) NOT NULL, \`userId\` varchar(36) NOT NULL, \`content\` text CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NOT NULL, \`title\` varchar(1000) NOT NULL, \`image\` varchar(255) NULL, \`category\` varchar(255) NULL DEFAULT 'Uncategorized', \`slug\` varchar(255) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`services\` ADD CONSTRAINT \`FK_3905389899d96c4f1b3619f68d5\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`services\` DROP FOREIGN KEY \`FK_3905389899d96c4f1b3619f68d5\``,
    );
    await queryRunner.query(`DROP TABLE \`services\``);
  }
}
