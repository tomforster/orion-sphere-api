import {ItemType} from "../entity/ItemType";
import {Service} from "./Service";
import {FilterOptions} from "./filters/FilterOptions";
import {Page} from "./filters/Page";
import {Pageable} from "./filters/Pageable";

export class ItemTypeService extends Service<ItemType, FilterOptions>
{
    entityClass = ItemType;
    
    async findAll(pageable:Pageable, filterOptions?:FilterOptions):Promise<Page<ItemType>>
    {
        let result, count:number;
        if (filterOptions && filterOptions.s)
        {
            const s = "%" + filterOptions.s + "%";
            
            let query = this.getRepository()
                .createQueryBuilder("it")
                .where("LOWER(it.name) like LOWER(:s)", {s});
    
            [result, count] = await query.getManyAndCount();
        }
        else
        {
            result = await this.getRepository().find();
            count = await this.getRepository().count();
        }
        
        return new Page<ItemType>(result.map(i => {(i as any).type = this.entityClass.name; return i}), 0, count, count);
    }
}