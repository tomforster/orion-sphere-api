import {MigrationInterface, QueryRunner} from "typeorm";

const numItemDefs = 100;
const numItems = 300;

export class gendata1535301003213 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any>
    {
        const ts = new Date().toLocaleString().replace(",", "");
        
        const prefix = ["Active", "Adjustable", "Alpha", "Anti-Tank", "Armageddon", "Atomic", "Attuned", "Augmented", "Battlestar",
            "Cataclysm", "Chaos", "Close-Defence", "Cruiser", "Cyclone", "Discharge", "Eclipse", "Energized", "Enhanced", "Explosive",
            "Fusion", "High-Frequency", "High-Power", "High-Speed", "Honed", "Infused", "Long-Range", "Low-Frequency", "Low-Power",
            "Multi-Load", "Multi-Shot", "Nuclear", "Oblivion", "Omega", "Pendulum", "Polarized", "Powered", "Penetrating", "Rapid-Fire",
            "Refined", "Reforged", "Renewed", "Self-Guided", "Short-Range", "Single-Load", "Single-Shot", "Standard", "Void", "Vortex",
            "Warp"];
        const it = [
            {id: 1, name:"Light Energy Weapon", code:"EL"},
            {id: 2, name:"Medium Energy Weapon", code:"EM"},
            {id: 3, name:"Heavy Energy Weapon", code:"EH"},
            {id: 4, name:"Small Melee Weapon", code:"MS"},
            {id: 5, name:"Medium Melee Weapon", code:"MM"},
            {id: 6, name:"Large Melee Weapon", code:"ML"},
            {id: 7, name:"Projectile", code:"PR"},
            {id: 8, name:"Shield", code:"SH"},
            {id: 9, name:"Light Armour", code:"AL"},
            {id: 10, name:"Medium Armour", code:"AM"},
            {id: 11, name:"Heavy Armour", code:"AH"},
            {id: 12, name:"Energy Field", code:"EF"},
            {id: 13, name:"Science Device - Analyser", code:"SA"},
            {id: 14, name:"Science Device - Detector", code:"SD"},
            {id: 15, name:"Science Device - Scanner", code:"SS"},
            {id: 16, name:"Science Device - Extractor", code:"SE"},
            {id: 17, name:"Medical Device", code:"DM"},
            {id: 18, name:"Device", code:"DG"},
            {id: 19, name:"Psionic Device", code:"DP"}];
            
        function itemDefGen(numItemDefs:number)
        {
            return Array.from({ length: numItemDefs}, () => 0)
                .map((_,i) => {
                    const selectedPrefix = Math.floor(Math.random() * prefix.length);
                    const selectedItemType = it[Math.floor(Math.random() * it.length)];
                    const selectedBaseCost = Math.floor(Math.random()*299)+1;
                    return {id: i+1, type: selectedItemType, name: prefix[selectedPrefix] + " " + selectedItemType.name, baseCost: selectedBaseCost};
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
        
        await queryRunner.query(`insert into "item_type" (id, name, code, "createdOn", version) values ${it.map((itemType, i) => `('${i+1}', '${itemType.name}', '${itemType.code}', '${ts}', 0)`).join(",")}`);
        await queryRunner.query(`insert into "item_model" (id, "itemTypeId", name, "baseCost", "createdOn", version) values ${itemDefs.map(itemDef => `(${itemDef.id}, ${itemDef.type.id}, '${itemDef.name}', ${itemDef.baseCost}, '${ts}', 0)`).join(",")}`);
        await queryRunner.query(`insert into "audit" ("auditType", "itemModelId", "createdOn") values ${itemDefs.map(itemDef => `(0, ${itemDef.id},'${ts}')`).join(",")}`);
        await queryRunner.query(`insert into "item" (id, "itemModelId", serial, "createdOn", version) values ${items.map(item => `(${item.id},${item.def}, '${this.generateSerial(item)}', '${ts}', 0)`).join(",")}`);
        await queryRunner.query(`insert into "audit" ("auditType", "itemId", "createdOn") values ${items.map(item => `(0, ${item.id},'${ts}')`).join(",")}`);
    
        await queryRunner.query(`SELECT setval('item_model_id_seq', ${numItemDefs})`);
        await queryRunner.query(`SELECT setval('item_id_seq', ${numItems})`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }
    
    private generateSerial(item)
    {
        return item.type.code + item.def.toString().padStart(4, "0") + "-" + item.id.toString().padStart(4, "0");
    }

}
