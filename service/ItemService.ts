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
            .leftJoinAndSelect("item.mods", "mods")
            .leftJoinAndSelect("mods.ability", "ability")
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
        
        const oldEntity = this.getRepository().findOne(entity.id);
        const newEntity = this.getRepository().save(entity);
        
        //save audit for mods todo
        Promise.all([oldEntity, newEntity]).then(r => {
            console.log("old", r[0].mods.map(mod => mod.description),
                "new", r[1].mods.map(mod => mod.description));
        });
        
        return newEntity;
    }
    
    private generateSerial(item:Item):string
    {
        if(!item) return "";
        return item.itemModel.itemType + item.itemModel.id.toString().padStart(4, "0") + "-" + item.id.toString().padStart(4, "0");
    }
}