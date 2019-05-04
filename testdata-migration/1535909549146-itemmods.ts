import {MigrationInterface, QueryRunner} from "typeorm";
import {addModModifier, getMultiplier, maintenanceModifier} from "../entity/Item";

export class itemmods1535909549146 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any>
    {
        const ts = new Date().toLocaleString().replace(",", "");
        
        const items = await queryRunner.query(`select i.*, im."itemTypeId" as itemtype, im."baseCost" as basecost from "item" i join "item_model" im on im.id = i."itemModelId"`);
        const mods = await queryRunner.query(`select * from "mod"`);
        const itemRestrictions = await queryRunner.query(`select r.* from mod_restricted_to_item_type r;`);
        const unrestrictedMods = await queryRunner.query(`select m.id from mod m left join mod_restricted_to_item_type mr on m.id = mr."modId" where mr."modId" is null;`);
        
        const modsToAdd:{itemId: number, modId:number, modName:string}[] = [];

        items.forEach(item => {
            itemRestrictions
                .filter(r => r.itemTypeId === item.itemtype)//get restrictions for item
                .map(r => r.modId)
                .concat(unrestrictedMods.map(m => m.id))
                .filter(() => Math.random() > 0.85).forEach(selectedModId => {
                    modsToAdd.push({itemId: item.id, modId:selectedModId, modName:mods.find(m => m.id === selectedModId)!.description})
                })
        });
        
        await queryRunner.query(`insert into "item_mod" ("itemId", "modId", "count", "createdOn", version) values ${modsToAdd.map(m => `(${m.itemId}, ${m.modId}, 1, '${ts}', 0)`).join(",")};`);
        await queryRunner.query(`insert into "audit" ("auditType", "itemId", "createdOn", description) values ${modsToAdd.map(m => `(1, ${m.itemId},'${ts}', 'Added Mod: ${m.modName}')`).join(",")}`);

        await Promise.all(items.map(async item =>
        {
            const itemId = item.id;
            const numMods = modsToAdd.filter(m => m.itemId === itemId).length;
            await queryRunner.query(`update item set "modCost" = ${getMultiplier(numMods)*addModModifier*item.basecost} where id = ${itemId}`);
            return queryRunner.query(`update item set "maintenanceCost" = ${getMultiplier(numMods)*maintenanceModifier*item.basecost} where id = ${itemId}`);
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any>
    {
    
    }

}
