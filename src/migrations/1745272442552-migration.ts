import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1745272442552 implements MigrationInterface {
    name = 'Migration1745272442552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_25f06021d5e959312ce6fabe3c7"`);
        await queryRunner.query(`ALTER TABLE "plan" ADD "currency" character varying(3) NOT NULL DEFAULT 'USD'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "currency"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_25f06021d5e959312ce6fabe3c7" FOREIGN KEY ("subscriptionId") REFERENCES "subscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
