import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1739133843089 implements MigrationInterface {
	name = 'Migration1739133843089';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "project" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "deletedAt" TIMESTAMP, "ownerId" uuid, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."subscription_plan_enum" AS ENUM('free', 'standard', 'premium')`,
		);
		await queryRunner.query(
			`CREATE TABLE "subscription" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "plan" "public"."subscription_plan_enum" NOT NULL DEFAULT 'free', "maxProjects" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "REL_cc906b4bc892b048f1b654d2aa" UNIQUE ("userId"), CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "refreshToken" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`ALTER TABLE "project" ADD CONSTRAINT "FK_9884b2ee80eb70b7db4f12e8aed" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "subscription" ADD CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "subscription" DROP CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0"`,
		);
		await queryRunner.query(
			`ALTER TABLE "project" DROP CONSTRAINT "FK_9884b2ee80eb70b7db4f12e8aed"`,
		);
		await queryRunner.query(`DROP TABLE "user"`);
		await queryRunner.query(`DROP TABLE "subscription"`);
		await queryRunner.query(`DROP TYPE "public"."subscription_plan_enum"`);
		await queryRunner.query(`DROP TABLE "project"`);
	}
}
