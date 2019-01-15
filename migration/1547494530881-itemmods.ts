import {MigrationInterface, QueryRunner} from "typeorm";

export class itemmods1547494530881 implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<any>
    {
        const ts = new Date().toLocaleString().replace(",", "");
        const itemModsMods = await queryRunner.query("select * from item_mods_mod");
        itemModsMods.forEach(itemModsMod => {
            itemModsMod.count = 1;
        });
        await queryRunner.query(`insert into item_mod ("itemId", "modId", "count", "createdOn", "version") values ${itemModsMods.map(m => `(${m.itemId}, ${m.modId}, 1, '${ts}', 0)`).join(",")}`);
        return queryRunner.dropTable("item_mods_mod");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }
}