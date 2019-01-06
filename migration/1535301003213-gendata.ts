import {MigrationInterface, QueryRunner} from "typeorm";

const numItemDefs = 100;
const numItems = 300;

export class gendata1535301003213 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const ts = new Date().toLocaleString().replace(",", "");
        
        const prefix = ["Active", "Adjustable", "Alpha", "Anti-Tank", "Armageddon", "Atomic", "Attuned", "Augmented", "Battlestar",
            "Cataclysm", "Chaos", "Close-Defence", "Cruiser", "Cyclone", "Discharge", "Eclipse", "Energized", "Enhanced", "Explosive",
            "Fusion", "High-Frequency", "High-Power", "High-Speed", "Honed", "Infused", "Long-Range", "Low-Frequency", "Low-Power",
            "Multi-Load", "Multi-Shot", "Nuclear", "Oblivion", "Omega", "Pendulum", "Polarized", "Powered", "Penetrating", "Rapid-Fire",
            "Refined", "Reforged", "Renewed", "Self-Guided", "Short-Range", "Single-Load", "Single-Shot", "Standard", "Void", "Vortex",
            "Warp"];
        const it = ["Light Energy Weapon", "Medium Energy Weapon", "Heavy Energy Weapon", "Small Melee Weapon", "Medium Melee Weapon",
            "Large Melee Weapon", "Projectile", "Shield", "Light Armour", "Medium Armour", "Heavy Armour", "Energy Field",
            "Science Device", "Medical Device", "General Device"];
        
        const itId = ["EL", "EM", "EH", "MS", "MM", "ML", "PR", "SH", "AL", "AM", "AH", "EF", "DS", "DM", "DG"];
            
        function itemDefGen(numItemDefs:number)
        {
            return Array.from({ length: numItemDefs}, () => 0)
                .map((_,i) => {
                    const selectedPrefix = Math.floor(Math.random() * prefix.length);
                    const selectedItemType = Math.floor(Math.random() * it.length);
                    const selectedBaseCost = Math.floor(Math.random()*299)+1;
                    return {id: i+1, type: itId[selectedItemType], name: prefix[selectedPrefix] + " " + it[selectedItemType], baseCost: selectedBaseCost};
                })
        }
        
        function itemGen(itemDefs, numItems:number)
        {
            return Array.from({ length: numItems}, () => 0)
                .map((_,i) => {
                    const selectedItemDef = Math.floor(Math.random() * itemDefs.length);
                    return {id:i+1, def: itemDefs[selectedItemDef].id, type: itemDefs[selectedItemDef].type};
                })
        }
    
        const itemDefs = itemDefGen(numItemDefs);
        const items = itemGen(itemDefs, numItems);
        
        await queryRunner.query(`insert into "item_model" (id, "itemType", name, "baseCost", "createdOn", version) values ${itemDefs.map(itemDef => `(${itemDef.id},'${itemDef.type}','${itemDef.name}', ${itemDef.baseCost}, '${ts}', 0)`).join(",")}`);
        await queryRunner.query(`insert into "audit" ("auditType", "itemModelId", "createdOn") values ${itemDefs.map(itemDef => `(0, ${itemDef.id},'${ts}')`).join(",")}`);
        await queryRunner.query(`insert into "item" (id, "itemModelId", serial, "createdOn", version) values ${items.map(item => `(${item.id},${item.def}, '${this.generateSerial(item)}', '${ts}', 0)`).join(",")}`);
        await queryRunner.query(`insert into "audit" ("auditType", "itemId", "createdOn") values ${itemDefs.map(item => `(0, ${item.id},'${ts}')`).join(",")}`);
    
        await queryRunner.query(`SELECT setval('item_model_id_seq', ${numItemDefs})`);
        await queryRunner.query(`SELECT setval('item_id_seq', ${numItems})`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }
    
    private generateSerial(item)
    {
        return item.type + item.def.toString().padStart(4, "0") + "-" + item.id.toString().padStart(4, "0");
    }

}
