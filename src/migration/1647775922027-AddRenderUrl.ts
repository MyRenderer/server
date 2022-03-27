import {MigrationInterface, QueryRunner} from "typeorm";

export class AddRenderUrl1647775922027 implements MigrationInterface {
    name = 'AddRenderUrl1647775922027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "server"."project" ADD "renderUrl" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "server"."project" DROP COLUMN "renderUrl"`);
    }

}
