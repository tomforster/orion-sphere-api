import {MigrationInterface, QueryRunner} from "typeorm";

export class itemConstraints1534797408112 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "orion_sphere"."REL_8d9a9168b4550740ee1aeb2316"`);
        await queryRunner.query(`ALTER TABLE "orion_sphere"."item" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "orion_sphere"."item" DROP COLUMN "baseCost"`);
        await queryRunner.query(`ALTER TABLE "orion_sphere"."item" DROP CONSTRAINT "FK_8d9a9168b4550740ee1aeb23162"`);
        await queryRunner.query(`ALTER TABLE "orion_sphere"."item" ADD CONSTRAINT "UQ_8d9a9168b4550740ee1aeb23162" UNIQUE ("itemDefinitionId")`);
        await queryRunner.query(`ALTER TABLE "orion_sphere"."item" ADD CONSTRAINT "FK_8d9a9168b4550740ee1aeb23162" FOREIGN KEY ("itemDefinitionId") REFERENCES "orion_sphere"."item_definition"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "orion_sphere"."item" DROP CONSTRAINT "FK_8d9a9168b4550740ee1aeb23162"`);
        await queryRunner.query(`ALTER TABLE "orion_sphere"."item" DROP CONSTRAINT "UQ_8d9a9168b4550740ee1aeb23162"`);
        await queryRunner.query(`ALTER TABLE "orion_sphere"."item" ADD CONSTRAINT "FK_8d9a9168b4550740ee1aeb23162" FOREIGN KEY ("itemDefinitionId") REFERENCES "orion_sphere"."item_definition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orion_sphere"."item" ADD "baseCost" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orion_sphere"."item" ADD "name" character varying(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`CREATE INDEX "REL_8d9a9168b4550740ee1aeb2316" ON "orion_sphere"."item"("itemDefinitionId") `);
    }

}
