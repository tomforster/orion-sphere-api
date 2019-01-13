import {Mod} from "../entity/Mod";
import {Service} from "./Service";
import {Brackets} from "typeorm";
import {FilterOptions} from "./filters/FilterOptions";

export class ModService extends Service<Mod, FilterOptions>
{
    entityClass:any = Mod;
    allowedSortFields:string[] = ["id", "description", "maxStacks"];
    
    getFindQuery = (filterOptions?:FilterOptions) =>
    {
        let query = this.getRepository()
            .createQueryBuilder("mod")
            .leftJoinAndSelect("mod.ability", "ability")
            .where("1=1");
        
        if(filterOptions && filterOptions.s)
        {
            const s = "%" + filterOptions.s + "%";
            query = query.andWhere(new Brackets(qb => {
                qb.where("LOWER(mod.description) like LOWER(:s)", {s})
            }));
        }
        return query;
    }
}