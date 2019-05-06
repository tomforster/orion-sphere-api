import {IImportItem} from "../interfaces/IImportItem";
import {getRepository} from "typeorm";
import {ItemType} from "../entity/ItemType";
import {Mod} from "../entity/Mod";
import {Ability} from "../entity/Ability";
import {ItemModel} from "../entity/ItemModel";
import {ItemMod} from "../entity/ItemMod";
import {itemService} from "../routes/ItemRoutes";
import {itemModelService} from "../routes/ItemModelRoutes";
import {Item} from "../entity/Item";
import {IItemMod} from "../interfaces/IItemMod";

export class ImportService
{
    constructor()
    {
    }
    
    async import(params:IImportItem):Promise<void>
    {
        console.info("item received", params);
        const modelRepo = getRepository(ItemModel);
        const itemType = await getRepository(ItemType).findOne({name:params.itemTypeName});
        let model = await modelRepo.findOne({name:params.name, itemType});
        
        const modRepo = getRepository(Mod);
        
        const mods = await Promise.all(params.modDescriptions.map(modDescription =>
        {
            if(modDescription === "Ablative Layers")
            {
                if(params.itemTypeName === "Light Armour")
                {
                    modDescription = "Ablative Layers (Light)";
                }
                else if(params.itemTypeName === "Medium Armour")
                {
                    modDescription = "Ablative Layers (Medium)";
                }
                else if(params.itemTypeName === "Heavy Armour")
                {
                    modDescription = "Ablative Layers (Heavy)";
                }
            }
            return modRepo.findOne({description:modDescription})
        }));
        for(let i = 0; i < mods.length; i++)
        {
            if(!mods[i]) console.log("Unknown mod", params.itemTypeName, params.modDescriptions[i]);
        }
        
        const abilityRepo = getRepository(Ability);
        
        const fixedAbilityDescriptions = [];
        params.abilityDescriptions.forEach(abilityDescription =>
        {
            const matcher = abilityDescription.match(/\+([0-9]) Armour Hits/);
            if(!matcher) fixedAbilityDescriptions.push(abilityDescription);
            else
            {
                for(let i = 0; i < parseInt(matcher[1]); i++)
                {
                    fixedAbilityDescriptions.push("+1 Armour Hit");
                }
            }
        });
        
        const abilities = await Promise.all(fixedAbilityDescriptions.map(abilityDescription =>
        {
            return abilityRepo.findOne({description: abilityDescription})
        }));
        
        for(let i = 0; i < abilities.length; i++)
        {
            if (!abilities[i])
            {
                console.log("Unknown ability");
            }
        }
    
        //create itemMods;
        const itemMods: IItemMod[] = [];
    
        mods.forEach(mod => {
            const existing = itemMods.find(itemMod => itemMod.id === mod.id);
            if(existing) existing.count++;
            else
            {
                itemMods.push({id:0, mod, count: 1});
            }
            //remove abilities from mods
            const abilityIndex = abilities.findIndex(ability => ability.id === mod.ability.id);
            if(abilityIndex > -1)
            {
                abilities.splice(abilityIndex, 1);
            }
            else
            {
                console.error("ability not found for mod", mod, params);
            }
        });
        
        if(abilities.length) console.info("abilities not from mods found: ", abilities, params);
    
        if(!model)
        {
            model = await itemModelService.create(new ItemModel({
                id: null,
                name: params.name,
                baseCost: params.baseCost,
                baseCharges: params.maxCharges,
                itemType: itemType,
                abilities: abilities,
                hasExoticSlot: true,
                maintOnly: params.maintOnly
            }));
            console.log("created new model: ", model);
        }
        
        // create item
        const item = await itemService.create({itemModel: model, id:0, itemMods});
        item.legacySerial = params.serial;
        await getRepository(Item).save(item);
        console.log("created item: ", item);
    }
}