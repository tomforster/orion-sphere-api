import {Mod} from "../entity/Mod";
import {Service} from "./Service";
import {Brackets, EventSubscriber} from "typeorm";
import {ModFilterOptions} from "./filters/ModFilterOptions";

@EventSubscriber()
export class ModService extends Service<Mod, ModFilterOptions>
{
    entityClass:any = Mod;
    allowedSortFields:string[] = ["id", "description", "maxStacks"];
    
    getFindQuery = (filterOptions?:ModFilterOptions) =>
    {
        let query = this.getRepository()
            .createQueryBuilder("mod")
            .leftJoinAndSelect("mod.ability", "ability")
            .leftJoinAndSelect("mod.restrictedTo", "restricted")
            .where("1=1");
        
        if(filterOptions && filterOptions.s)
        {
            const s = "%" + filterOptions.s + "%";
            query = query.andWhere(new Brackets(qb => {
                qb.where("LOWER(mod.description) like LOWER(:s)", {s})
            }));
        }
        
        if(filterOptions && filterOptions.itemTypeId)
        {
            query = query.andWhere(new Brackets(qb => {
                qb.where(`restricted."id" = :id`, {id:filterOptions.itemTypeId})
            }));
        }
        return query;
    }
}