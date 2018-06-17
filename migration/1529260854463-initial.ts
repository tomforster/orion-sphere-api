import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1529260854463 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "orion_sphere"."item_definition" ("id" SERIAL NOT NULL, "itemType" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_9b2371aab7a05fbfabc9a827fa9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orion_sphere"."item" ("id" SERIAL NOT NULL, "itemDefinitionId" integer, CONSTRAINT "REL_8d9a9168b4550740ee1aeb2316" UNIQUE ("itemDefinitionId"), CONSTRAINT "PK_b47a7f9f364c469672670dbdaea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "orion_sphere"."item" ADD CONSTRAINT "FK_8d9a9168b4550740ee1aeb23162" FOREIGN KEY ("itemDefinitionId") REFERENCES "orion_sphere"."item_definition"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "orion_sphere"."item" DROP CONSTRAINT "FK_8d9a9168b4550740ee1aeb23162"`);
        await queryRunner.query(`DROP TABLE "orion_sphere"."item"`);
        await queryRunner.query(`DROP TABLE "orion_sphere"."item_definition"`);
    }

}
