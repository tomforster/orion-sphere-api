import {Item} from "../entity/Item";
import {Service} from "./Service";
import {validateOrReject} from "class-validator";
import {ItemFilterOptions} from "./filters/ItemFilterOptions";
import {Brackets, getManager} from "typeorm";
import {Audit} from "../entity/Audit";
import {AuditType} from "../AuditType";
import {ItemMod} from "../entity/ItemMod";

export class ItemService extends Service<Item, ItemFilterOptions>
{
    entityClass:any = Item;
    allowedSortFields:string[] = ["id", "serial", "maintenanceCost", "modCost", "model.name"];
    
    getFindQuery = (filterOptions?:ItemFilterOptions) =>
    {
        let query = this.getRepository()
            .createQueryBuilder("item")
            .leftJoinAndSelect("item.itemModel", "model")
            .leftJoinAndSelect("model.itemType", "itemType")
            .leftJoinAndSelect("item.itemMods", "itemMods")
            .leftJoinAndSelect("itemMods.mod", "mod")
            .leftJoinAndSelect("mod.ability", "ability")
            .where("1=1");
    
        if(filterOptions && filterOptions.s)
        {
            const s = "%" + filterOptions.s + "%";
            query = query.andWhere(new Brackets(qb => {
                qb.where("LOWER(model.name) like LOWER(:s)", {s})
                    .orWhere("LOWER(item.serial) like LOWER(:s)", {s})
            }));
        }
        
        if(filterOptions && filterOptions.itemModel && filterOptions.itemModel.itemTypeId)
        {
            query = query.andWhere("itemType.id = :itemType", {itemType:filterOptions.itemModel.itemTypeId});
        }
        
        return query;
    };
    
    async create(params:Item):Promise<Item>
    {
        const entity = new Item(params);
        entity.id = undefined;
        entity.serial = "";
        await validateOrReject(entity, {groups: ["create"]});
        const newEntity = await this.getRepository().save(entity);
        newEntity.serial = this.generateSerial(newEntity);
        return this.getRepository().save(newEntity);
    }
    
    async update(params:Item):Promise<Item>
    {
        const entity = new Item(params);
        await validateOrReject(entity, {groups: ["update"]});
        
        //todo check that itemmodel matches mods.
        
        const oldEntity = await this.getRepository().findOne(entity.id);
        const newEntity = await this.getRepository().save(entity);
        
        //save mods
        const itemModRepo = getManager().getRepository(ItemMod);
        await itemModRepo.save(newEntity.itemMods);
        
        const audits:Audit[] = [];
        
        oldEntity.itemMods
            .filter(oldItemMod => !newEntity.itemMods.find(newItemMod => newItemMod.id === oldItemMod.id))
            .forEach(oldItemMod => {
                for(let i = 0; i < oldItemMod.count; i++)
                {
                    audits.push(new Audit(AuditType.update, "Item", entity.id, "Removed Mod: " + oldItemMod.mod.description));
                }
            });
        
        newEntity.itemMods.forEach(itemMod =>
        {
            const oldItemMod = oldEntity.itemMods.find(oldItemMod => oldItemMod.id === itemMod.id);
            if(!oldItemMod){
                for(let i = 0; i < itemMod.count; i++)
                {
                    audits.push(new Audit(AuditType.update, "Item", entity.id, "Added Mod: " + itemMod.mod.description));
                }
            }
            else if(oldItemMod.count > itemMod.count)
            {
                const difference = oldItemMod.count - itemMod.count;
                for(let i = 0; i < difference; i++)
                {
                    audits.push(new Audit(AuditType.update, "Item", entity.id, "Removed Mod: " + oldItemMod.mod.description));
                }
            }
            else if(oldItemMod.count < itemMod.count)
            {
                const difference = itemMod.count - oldItemMod.count;
                for(let i = 0; i < difference; i++)
                {
                    audits.push(new Audit(AuditType.update, "Item", entity.id, "Added Mod: " + oldItemMod.mod.description));
                }
            }
        });
        
        await getManager().getRepository(Audit).save(audits);
        
        newEntity.itemMods.forEach(itemMod => delete itemMod.item);
        return newEntity;
    }
    
    private generateSerial(item:Item):string
    {
        if(!item) return "";
        return item.itemModel.itemType + item.itemModel.id.toString().padStart(4, "0") + "-" + item.id.toString().padStart(4, "0");
    }
}