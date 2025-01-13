import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePostTable1736780240730 implements MigrationInterface {
    name = 'UpdatePostTable1736780240730'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`posts\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD \`content\` text CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`posts\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD \`content\` varchar(10000) NOT NULL`);
    }

}
