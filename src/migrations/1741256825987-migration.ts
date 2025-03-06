import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1741256825987 implements MigrationInterface {
    name = 'Migration1741256825987'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "maxProjects"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "plan" ADD CONSTRAINT "UQ_8aa73af67fa634d33de9bf874ab" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan" DROP CONSTRAINT "UQ_8aa73af67fa634d33de9bf874ab"`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "maxProjects" integer`);
    }

}
