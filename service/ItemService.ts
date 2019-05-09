import {Item} from "../entity/Item";
import {Service} from "./Service";
import {ItemFilterOptions} from "./filters/ItemFilterOptions";
import {Brackets, EventSubscriber, getManager} from "typeorm";
import {ItemMod} from "../entity/ItemMod";
import {Audit} from "../entity/Audit";
import {AuditType} from "../AuditType";
import {IItem} from "../interfaces/IItem";

@EventSubscriber()
export class ItemService extends Service<Item, ItemFilterOptions>
{
    entityClass:any = Item;
    allowedSortFields:string[] = ["id", "serial", "maintenanceCost", "modCost", "model.name"];
    auditExclusions:string[] = ["deleted", "modCost", "serial", "maintenanceCost", "legacySerial"];
    
    getFindQuery = (filterOptions?:ItemFilterOptions) =>
    {
        let query = this.getRepository()
            .createQueryBuilder("item")
            .leftJoinAndSelect("item.itemModel", "model")
            .leftJoinAndSelect("model.itemType", "itemType")
            .leftJoinAndSelect("item.itemMods", "itemMods")
            .leftJoinAndSelect("itemMods.mod", "mod")
            .leftJoinAndSelect("mod.ability", "ability")
            .where("item.deleted=false");
    
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
    
    async create(params:IItem):Promise<Item>
    {
        params.id = undefined;
        params.serial = "";
        let newEntity = await super.create(params);
        newEntity.serial = this.generateSerial(newEntity);
        newEntity = await this.getRepository().save(newEntity);
        await getManager().getRepository(ItemMod).save(newEntity.itemMods);
        newEntity.itemMods.forEach(itemMod => delete itemMod.item);
        return newEntity;
    }
    
    async update(params:IItem):Promise<Item>
    {
        const item = await this.getRepository().findOne(params.id);
        const entity = new Item(params);
        entity.legacySerial = item.legacySerial;
        
        const newEntity = await super.update(params);
        newEntity.itemMods.forEach(itemMod => delete itemMod.item);
        return newEntity;
    }
    
    private generateSerial(item:IItem):string
    {
        if(!item) return "";
        return item.itemModel.itemType.code + item.itemModel.id.toString().padStart(4, "0") + "-" + item.id.toString().padStart(4, "0");
    }
    
    async addAdditionalAudits(audits:Audit[], newEntity:Item, oldEntity:Item)
    {
        oldEntity.itemMods
            .filter(oldItemMod => !newEntity.itemMods.find(newItemMod => newItemMod.id === oldItemMod.id))
            .forEach(oldItemMod => {
                for(let i = 0; i < oldItemMod.count; i++)
                {
                    audits.push(new Audit(AuditType.update, "Item", newEntity.id, "Removed Mod: " + oldItemMod.mod.description));
                }
            });
    
        newEntity.itemMods.forEach(itemMod =>
        {
            const oldItemMod = oldEntity.itemMods.find(oldItemMod => oldItemMod.id === itemMod.id);
            if(!oldItemMod){
                for(let i = 0; i < itemMod.count; i++)
                {
                    audits.push(new Audit(AuditType.update, "Item", newEntity.id, "Added Mod: " + itemMod.mod.description));
                }
            }
            else if(oldItemMod.count > itemMod.count)
            {
                const difference = oldItemMod.count - itemMod.count;
                for(let i = 0; i < difference; i++)
                {
                    audits.push(new Audit(AuditType.update, "Item", newEntity.id, "Removed Mod: " + oldItemMod.mod.description));
                }
            }
            else if(oldItemMod.count < itemMod.count)
            {
                const difference = itemMod.count - oldItemMod.count;
                for(let i = 0; i < difference; i++)
                {
                    audits.push(new Audit(AuditType.update, "Item", newEntity.id, "Added Mod: " + oldItemMod.mod.description));
                }
            }
        });
    
        //save mods
        await getManager().getRepository(ItemMod).save(newEntity.itemMods);
    }
}