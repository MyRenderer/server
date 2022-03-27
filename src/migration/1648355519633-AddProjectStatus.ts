import {MigrationInterface, QueryRunner} from "typeorm";

export class AddProjectStatus1648355519633 implements MigrationInterface {
    name = 'AddProjectStatus1648355519633'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "server"."project" ADD "status" text NOT NULL DEFAULT 'stopped'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "server"."project" DROP COLUMN "status"`);
    }

}
