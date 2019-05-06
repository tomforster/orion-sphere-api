import {ItemType} from "../entity/ItemType";
import {Service} from "./Service";
import {FilterOptions} from "./filters/FilterOptions";
import {Page} from "./filters/Page";

export class ItemTypeService extends Service<ItemType, FilterOptions>
{
    entityClass = ItemType;
    
    async findAll():Promise<Page<ItemType>>
    {
        let result, count:number;
        result = await this.getRepository().find();
        count = await this.getRepository().count();
        return new Page<ItemType>(result.map(i => {(i as any).type = this.entityClass.name; return i}), 0, count, count);
    }
}