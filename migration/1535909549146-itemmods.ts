import {MigrationInterface, QueryRunner} from "typeorm";

export class itemmods1535909549146 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any>
    {
        const ts = new Date().toLocaleString().replace(",", "");
        
        const items = await queryRunner.query(`select i.*, im."itemType" as itemType from "item" i join "item_model" im on im.id = i."itemModelId"`);
        const mods = await queryRunner.query(`select * from "mod"`);
        
        const itemsWithMods = items.map(item => {
            const candidateMods = mods.filter(mod => mod.restrictedTo === "" || mod.restrictedTo.indexOf(item.itemtype) >= 0);
            const selectedMods = candidateMods.filter(mod => Math.random() > 0.85);
            return {
                mods:selectedMods, itemId:item.id
            };
        }).filter(i => i.mods);
        
        const modsToAdd:{itemId: number, mod:any}[] = [];
        itemsWithMods.forEach(itemMods => itemMods.mods.forEach(mod => modsToAdd.push({itemId: itemMods.itemId, mod})));
        
        await queryRunner.query(`insert into "item_mods_mod" ("itemId", "modId") values ${modsToAdd.map(m => `(${m.itemId}, ${m.mod.id})`).join(",")};`);
        await queryRunner.query(`insert into "audit" ("auditType", "itemId", "createdOn", description) values ${modsToAdd.map(m => `(1, ${m.itemId},'${ts}', 'Added Mod: ${m.mod.description}')`).join(",")}`);
    }

    public async down(queryRunner: QueryRunner): Promise<any>
    {
    
    }

}
