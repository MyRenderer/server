import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1647736767551 implements MigrationInterface {
    name = 'Initial1647736767551'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // socket.io adapter
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "server".socket_io_attachments (
                id          bigserial UNIQUE,
                created_at  timestamptz DEFAULT NOW(),
                payload     bytea
            );
        `);
        await queryRunner.query(`CREATE TABLE "server"."project" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "inputStreamUrl" text, "outputStreamUrl" text, "createTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT Now(), CONSTRAINT "PK_eb7e8219fb77f5de802bebd86e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "server"."overlay" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "templateId" text NOT NULL, "properties" jsonb NOT NULL DEFAULT '{}', "status" text NOT NULL DEFAULT 'down', "createTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT Now(), "projectId" uuid NOT NULL, CONSTRAINT "PK_5b9362d17a26b022a98421359c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "server"."overlay" ADD CONSTRAINT "FK_5778ba98616bf96c2bb11100474" FOREIGN KEY ("projectId") REFERENCES "server"."project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "server"."overlay" DROP CONSTRAINT "FK_5778ba98616bf96c2bb11100474"`);
        await queryRunner.query(`DROP TABLE "server"."overlay"`);
        await queryRunner.query(`DROP TABLE "server"."project"`);
    }

}
