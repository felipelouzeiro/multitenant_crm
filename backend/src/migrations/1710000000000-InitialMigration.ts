import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1710000000000 implements MigrationInterface {
    name = 'InitialMigration1710000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Criar enum UserRole
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('ADMIN', 'USER', 'GUEST')`);
        
        // Criar tabela users
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'GUEST', "refreshToken" character varying, "tenantId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        
        // Criar tabela clients
        await queryRunner.query(`CREATE TABLE "clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "publicId" character varying NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "contact" character varying, "address" jsonb NOT NULL, "imageUrl" character varying, "tenantId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_96aabace7a9b1b3c6e4b8b8b8b8" UNIQUE ("publicId"), CONSTRAINT "UQ_96aabace7a9b1b3c6e4b8b8b8b9" UNIQUE ("email"), CONSTRAINT "PK_96aabace7a9b1b3c6e4b8b8b8b8a" PRIMARY KEY ("id"))`);
        
        // Criar índices
        await queryRunner.query(`CREATE INDEX "IDX_users_tenantId" ON "users" ("tenantId")`);
        await queryRunner.query(`CREATE INDEX "IDX_clients_tenantId" ON "clients" ("tenantId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_clients_tenantId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_users_tenantId"`);
        await queryRunner.query(`DROP TABLE "clients"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    }
}
