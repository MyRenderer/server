import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserAndRole1651677352344 implements MigrationInterface {
    name = 'AddUserAndRole1651677352344'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "server"."user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" text NOT NULL, "password" text, "createTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleteTime" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_7e34da2d4a9e23e3a29d1c5af0a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "server"."role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "userId" uuid, CONSTRAINT "PK_77fbb52d800cdca8c698bc0ddcc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "server"."role" ADD CONSTRAINT "FK_d1f23b7b510f55fb1235bb75de1" FOREIGN KEY ("userId") REFERENCES "server"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "server"."role" DROP CONSTRAINT "FK_d1f23b7b510f55fb1235bb75de1"`);
        await queryRunner.query(`DROP TABLE "server"."role"`);
        await queryRunner.query(`DROP TABLE "server"."user"`);
    }

}
