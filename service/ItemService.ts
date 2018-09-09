import {Item} from "../entity/Item";
import {Service} from "./Service";
import {validate} from "class-validator";
import {ItemFilterOptions} from "./filters/ItemFilterOptions";
import {Brackets} from "typeorm";
import {Page} from "../Page";

export class ItemService extends Service<Item>
{
    entityClass:any = Item;
    
    async findAll(page:number, size:number, filterOptions:ItemFilterOptions):Promise<Page<Item>>
    {
        let query = this.getRepository()
            .createQueryBuilder("item")
            .leftJoinAndSelect("item.itemModel", "model")
            .leftJoinAndSelect("item.mods", "mods")
            .leftJoinAndSelect("mods.ability", "ability")
            .where("1=1");
        
        if(filterOptions.s)
        {
            const s = "%" + filterOptions.s + "%";
            query = query.andWhere(new Brackets(qb => {
                qb.where("LOWER(model.name) like LOWER(:s)", {s})
                    .orWhere("LOWER(item.serial) like LOWER(:s)", {s})
            }));
        }
        
        if(filterOptions.itemModel && filterOptions.itemModel.itemType)
        {
            query = query.andWhere("model.itemType = :itemType", {itemType:filterOptions.itemModel.itemType});
        }
        
        query.skip(page*size);
        query.take(size);

        const [result, count] = await query.getManyAndCount();

        return new Page<Item>(result.map(i => {(i as any).type = this.entityClass.name; return i}), page, size, count);
    }
    
    create(params:Item):Promise<Item>
    {
        const entity = new Item(undefined, params.itemModel);
        if(!validate(entity)) throw new Error("Invalid Argument");
        return this.getRepository().save(entity);
    }
    
    update(params:Item):Promise<Item>
    {
        const entity = new Item(params.id, params.itemModel);
        if(!validate(entity)) throw new Error("Invalid Argument");
        return this.getRepository().save(entity);
    }
    
    private generateSerial(item:Item):string
    {
        if(!item) return "";
        return item.itemModel.itemType + item.itemModel.id.toString().padStart(4, "0") + "-" + item.id.toString().padStart(4, "0");
    }
}