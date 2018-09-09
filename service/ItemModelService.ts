import {ItemModel} from "../entity/ItemModel";
import {Service} from "./Service";
import {validate} from "class-validator";
import {Brackets} from "typeorm";
import {Page} from "../Page";
import {ItemModelFilterOptions} from "./filters/ItemModelFilterOptions";

export class ItemModelService extends Service<ItemModel>
{
    entityClass:any = ItemModel;
    
    async findAll(page:number, size:number, filterOptions:ItemModelFilterOptions):Promise<Page<ItemModel>>
    {
        let query = this.getRepository()
            .createQueryBuilder("itemModel")
            .leftJoinAndSelect("itemModel.abilities", "abilities")
            .where("1=1");
        
        if(filterOptions.s)
        {
            const s = "%" + filterOptions.s + "%";
            query = query.andWhere(new Brackets(qb => {
                qb.where("LOWER(itemModel.name) like LOWER(:s)", {s})
            }));
        }
        
        if(filterOptions.itemType)
        {
            query = query.andWhere("itemModel.itemType = :itemType", {itemType:filterOptions.itemType});
        }
        
        query.skip(page*size);
        query.take(size);
        
        const [result, count] = await query.getManyAndCount();
        
        return new Page<ItemModel>(result.map(i => {(i as any).type = this.entityClass.name; return i}), page, size, count);
    }
    
    create(params:ItemModel):Promise<ItemModel>
    {
        const entity = new ItemModel(undefined, params.itemType, params.name);
        if(!validate(entity)) throw new Error("Invalid Argument");
        return this.getRepository().save(entity);
    }
    
    update(params:ItemModel):Promise<ItemModel>
    {
        const entity = new ItemModel(undefined, params.itemType, params.name);
        if(!validate(entity)) throw new Error("Invalid Argument");
        return this.getRepository().save(entity);
    }
}