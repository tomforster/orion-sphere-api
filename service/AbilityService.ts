import {Ability} from "../entity/Ability";
import {Service} from "./Service";
import {FilterOptions} from "./filters/FilterOptions";
import {Brackets, EventSubscriber} from "typeorm";

@EventSubscriber()
export class AbilityService extends Service<Ability, FilterOptions>
{
    entityClass:any = Ability;
    allowedSortFields:string[] = ["id", "description", "chargeCost"];
    
    getFindQuery = (filterOptions?:FilterOptions) =>
    {
        let query = this.getRepository()
            .createQueryBuilder("ability")
            .where("1=1");
        
        if(filterOptions && filterOptions.s)
        {
            const s = "%" + filterOptions.s + "%";
            query = query.andWhere(new Brackets(qb => {
                qb.where("LOWER(ability.description) like LOWER(:s)", {s})
            }));
        }
        
        return query;
    }
}