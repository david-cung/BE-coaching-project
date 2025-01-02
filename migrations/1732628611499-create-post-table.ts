import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePostTable1732628611499 implements MigrationInterface {
    name = 'CreatePostTable1732628611499'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`posts\` (\`id\` varchar(36) NOT NULL, \`userId\` varchar(36) NOT NULL, \`content\` varchar(10000) NOT NULL, \`title\` varchar(1000) NOT NULL, \`image\` varchar(255) NULL, \`category\` varchar(255) NOT NULL DEFAULT 'Uncategorized', \`slug\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_ae05faaa55c866130abef6e1fee\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_ae05faaa55c866130abef6e1fee\``);
        await queryRunner.query(`DROP TABLE \`posts\``);
    }

}
