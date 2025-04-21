import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1745268406111 implements MigrationInterface {
    name = 'Migration1745268406111'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "maxProjects"`);
        await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "durationDays"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "startsAt"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "plan" ADD "credits" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "credits" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "credits"`);
        await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "credits"`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "expiresAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "startsAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "plan" ADD "durationDays" integer NOT NULL DEFAULT '30'`);
        await queryRunner.query(`ALTER TABLE "plan" ADD "maxProjects" integer NOT NULL`);
    }

}
