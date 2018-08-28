import {MigrationInterface, QueryRunner} from "typeorm";

export class gendata1535301003213 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
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
                    return {id:i+1, def: itemDefs[selectedItemDef].id};
                })
        }
    
        const itemDefs = itemDefGen(200);
        const items = itemGen(itemDefs, 2000);
        
        await queryRunner.query(`insert into "orion_sphere"."item_model" (id, "itemType", name, "baseCost") values ${itemDefs.map(itemDef => `(${itemDef.id},'${itemDef.type}','${itemDef.name}', ${itemDef.baseCost})`).join(",")}`);
        return await queryRunner.query(`insert into "orion_sphere"."item" (id, "itemModelId") values ${items.map(item => `(${item.id},${item.def})`).join(",")}`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
