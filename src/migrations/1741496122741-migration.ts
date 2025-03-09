import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1741496122741 implements MigrationInterface {
    name = 'Migration1741496122741'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "errorMessage"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "errorMessage" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "errorMessage"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "errorMessage" character varying(255)`);
    }

}
