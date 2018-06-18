import {MigrationInterface, QueryRunner} from "typeorm";

export class testData1529352074637 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`INSERT INTO "orion_sphere"."item_definition" ("id", "itemType", "name") VALUES
            (1, 1, 'Light Energy Gun Test'),
            (2, 2, 'Medium Energy Gun Test'),
            (3, 3, 'Heavy Energy Gun Test'),
            (4, 1, 'Other Light Energy Gun Test'),
            (5, 6, 'Large Melee Test');`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`delete i.* from "orion_sphere"."item_definition" i where "id" < 6 ;`);
    }

}
