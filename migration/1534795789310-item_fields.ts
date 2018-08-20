import {MigrationInterface, QueryRunner} from "typeorm";

export class itemFields1534795789310 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "orion_sphere"."item" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "orion_sphere"."item" DROP COLUMN "baseCost"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "orion_sphere"."item" ADD "baseCost" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orion_sphere"."item" ADD "name" character varying(255) NOT NULL DEFAULT ''`);
    }

}
