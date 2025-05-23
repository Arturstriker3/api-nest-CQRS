import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1747986530684 implements MigrationInterface {
    name = 'Migration1747986530684'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" character varying(1024) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "ownerId" uuid, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plan" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "description" character varying(255), "price" numeric(10,2) NOT NULL, "currency" character varying(3) NOT NULL DEFAULT 'USD', "credits" integer NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8aa73af67fa634d33de9bf874ab" UNIQUE ("name"), CONSTRAINT "PK_54a2b686aed3b637654bf7ddbb3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."payment_status_enum" AS ENUM('pending', 'processing', 'completed', 'failed', 'canceled', 'refunded')`);
        await queryRunner.query(`CREATE TYPE "public"."payment_provider_enum" AS ENUM('stripe', 'paypal', 'mercadopago', 'pix', 'credit_card', 'bank_slip', 'other')`);
        await queryRunner.query(`CREATE TABLE "payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "subscriptionId" uuid, "amount" numeric(10,2) NOT NULL, "currency" character varying(10) NOT NULL, "status" "public"."payment_status_enum" NOT NULL DEFAULT 'pending', "provider" "public"."payment_provider_enum" NOT NULL, "providerPaymentId" character varying(255), "providerCustomerId" character varying(255), "providerMetadata" jsonb, "description" character varying(255), "errorMessage" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subscription" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "paymentId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "planId" uuid, "userId" uuid, CONSTRAINT "REL_cc906b4bc892b048f1b654d2aa" UNIQUE ("userId"), CONSTRAINT "REL_166c9f050dd956fcb00e9a8276" UNIQUE ("paymentId"), CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'admin')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "credits" integer NOT NULL DEFAULT '0', "refreshToken" character varying(512), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_9884b2ee80eb70b7db4f12e8aed" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_b046318e0b341a7f72110b75857" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_6b6d0e4dc88105a4a11103dd2cd" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_166c9f050dd956fcb00e9a8276c" FOREIGN KEY ("paymentId") REFERENCES "payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_166c9f050dd956fcb00e9a8276c"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_6b6d0e4dc88105a4a11103dd2cd"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_b046318e0b341a7f72110b75857"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_9884b2ee80eb70b7db4f12e8aed"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "subscription"`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TYPE "public"."payment_provider_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payment_status_enum"`);
        await queryRunner.query(`DROP TABLE "plan"`);
        await queryRunner.query(`DROP TABLE "project"`);
    }

}
