import {Item} from "../entity/Item";
import {Service} from "./Service";
import {validateOrReject} from "class-validator";
import {ItemFilterOptions} from "./filters/ItemFilterOptions";
import {Brackets} from "typeorm";

export class ItemService extends Service<Item, ItemFilterOptions>
{
    entityClass:any = Item;
    allowedSortFields:string[] = ["id", "serial"];
    
    getFindQuery = (filterOptions?:ItemFilterOptions) =>
    {
        let query = this.getRepository()
            .createQueryBuilder("item")
            .leftJoinAndSelect("item.itemModel", "model")
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
        
        if(filterOptions && filterOptions.itemModel && filterOptions.itemModel.itemType)
        {
            query = query.andWhere("model.itemType = :itemType", {itemType:filterOptions.itemModel.itemType});
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
        
        const oldEntity = await this.getRepository().findOne(entity.id);
        const newEntity = await this.getRepository().save(entity);
        const newEntity2 = await this.getRepository().findOne(entity.id);
        
        //save audit for mods todo
        console.log("old", oldEntity.itemMods.map(im => im.mod.description + " " +im.count));
        console.log("new", newEntity.itemMods.map(im => im.mod.description + " " +im.count));
        console.log("new2", newEntity2.itemMods.map(im => im.mod.description + " " +im.count));
        
        newEntity.itemMods.forEach(itemMod => delete itemMod.item);
        return newEntity;
    }
    
    private generateSerial(item:Item):string
    {
        if(!item) return "";
        return item.itemModel.itemType + item.itemModel.id.toString().padStart(4, "0") + "-" + item.id.toString().padStart(4, "0");
    }
}