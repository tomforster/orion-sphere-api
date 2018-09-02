import {MigrationInterface, QueryRunner} from "typeorm";

export class itemmods1535909549146 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any>
    {
        const items = await queryRunner.query(`select i.*, im."itemType" as itemType from "orion_sphere"."item" i join "orion_sphere"."item_model" im on im.id = i."itemModelId"`);
        const mods = await queryRunner.query(`select * from "orion_sphere"."mod"`);
        
        const itemsWithMods = items.map(item => {
            const candidateMods = mods.filter(mod => mod.restrictedTo === "" || mod.restrictedTo.indexOf(item.itemtype) >= 0);
            return {mods:candidateMods.filter(mod => Math.random() > 0.7).map(mod => mod.id), item:item.id};
        });
        
        const modsToAdd = [];
        
        itemsWithMods.forEach(itemMods => itemMods.mods.forEach(mod => modsToAdd.push({item: itemMods.item, mod})));
        
        return queryRunner.query(`insert into "orion_sphere"."item_mods_mod" ("itemId", "modId") values ${modsToAdd.map(m => `(${m.item}, ${m.mod})`).join(",")};`);
    }

    public async down(queryRunner: QueryRunner): Promise<any>
    {
    
    }

}
