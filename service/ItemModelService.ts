import {ItemModel} from "../entity/ItemModel";
import {Service} from "./Service";
import {Brackets} from "typeorm";
import {ItemModelFilterOptions} from "./filters/ItemModelFilterOptions";

export class ItemModelService extends Service<ItemModel, ItemModelFilterOptions>
{
    entityClass:any = ItemModel;
    allowedSortFields:string[] = ["id", "name", "baseCost", "baseCharges", "createdOn"];
    
    getFindQuery = (filterOptions?:ItemModelFilterOptions) =>
    {
        let query = this.getRepository()
            .createQueryBuilder("item_model")
            .leftJoinAndSelect("item_model.itemType", "itemType")
            .leftJoinAndSelect("item_model.abilities", "abilities")
            .where("1=1");
    
        if(filterOptions && filterOptions.s)
        {
            const s = "%" + filterOptions.s + "%";
            query = query.andWhere(new Brackets(qb => {
                qb.where("LOWER(item_model.name) like LOWER(:s)", {s})
            }));
        }
    
        if(filterOptions && filterOptions.itemTypeId)
        {
            query = query.andWhere("itemType.id = :itemType", {itemType:filterOptions.itemTypeId});
        }
    
        return query;
    }
}