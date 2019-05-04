import {IImportItem} from "../interfaces/IImportItem";
import {getRepository} from "typeorm";
import {ItemType} from "../entity/ItemType";
import {Mod} from "../entity/Mod";

export class ImportService
{
    async import(params:IImportItem):Promise<void>
    {
        const model = await getRepository(ItemType).findOne({name:params.name});
        // console.log(model);
        
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
            if(!mods[i]) console.log(params.itemTypeName, params.modDescriptions[i]);
        }
        
        // await validateOrReject(newEntity, {groups: ["create"], validationError:{target:false}});
        // newEntity = await this.getRepository().save(newEntity);
        
        // await getManager().getRepository(ItemMod).save(newEntity.itemMods);
        // newEntity.itemMods.forEach(itemMod => delete itemMod.item);
        // return newEntity;
    }
}