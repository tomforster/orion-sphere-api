import {MigrationInterface, QueryRunner} from "typeorm";
import {addModModifier, getMultiplier, maintenanceModifier} from "../entity/Item";

export class itemmods1535909549146 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any>
    {
        const ts = new Date().toLocaleString().replace(",", "");
        
        const items = await queryRunner.query(`select i.*, im."itemType" as itemtype, im."baseCost" as basecost from "item" i join "item_model" im on im.id = i."itemModelId"`);
        const mods = await queryRunner.query(`select * from "mod"`);
        
        const itemsWithMods = items.map(item => {
            const candidateMods = mods.filter(mod => mod.restrictedTo === "" || mod.restrictedTo.indexOf(item.itemtype) >= 0);
            const selectedMods = candidateMods.filter(() => Math.random() > 0.85);
            return {
                mods:selectedMods, itemId:item.id, baseCost: item.basecost
            };
        }).filter(i => i.mods);

        const modsToAdd:{itemId: number, mod:any}[] = [];
        itemsWithMods.forEach(itemMods => itemMods.mods.forEach(mod => modsToAdd.push({itemId: itemMods.itemId, mod})));

        await queryRunner.query(`insert into "item_mod" ("itemId", "modId", "count", "createdOn", version) values ${modsToAdd.map(m => `(${m.itemId}, ${m.mod.id}, 1, '${ts}', 0)`).join(",")};`);
        await queryRunner.query(`insert into "audit" ("auditType", "itemId", "createdOn", description) values ${modsToAdd.map(m => `(1, ${m.itemId},'${ts}', 'Added Mod: ${m.mod.description}')`).join(",")}`);

        await Promise.all(itemsWithMods.map(async itemWithMods =>
        {
            const itemId = itemWithMods.itemId;
            const numMods = itemWithMods.mods.length;
            await queryRunner.query(`update item set "modCost" = ${getMultiplier(numMods)*addModModifier*itemWithMods.baseCost} where id = ${itemId}`);
            return queryRunner.query(`update item set "maintenanceCost" = ${getMultiplier(numMods)*maintenanceModifier*itemWithMods.baseCost} where id = ${itemId}`);
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any>
    {
    
    }

}
