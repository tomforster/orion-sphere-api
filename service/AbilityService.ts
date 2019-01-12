import {Ability} from "../entity/Ability";
import {Service} from "./Service";
import {FilterOptions} from "./filters/FilterOptions";
import {Page} from "../Page";
import {Brackets} from "typeorm";

export class AbilityService extends Service<Ability>
{
    entityClass:any = Ability;
    
    async findAll(filterOptions:FilterOptions):Promise<Page<Ability>>
    {
        const {page, size} = filterOptions;
        
        let query = this.getRepository()
            .createQueryBuilder("ability")
            .where("1=1");
        
        if(filterOptions.s)
        {
            const s = "%" + filterOptions.s + "%";
            query = query.andWhere(new Brackets(qb => {
                qb.where("LOWER(ability.description) like LOWER(:s)", {s})
            }));
        }
        
        query.skip(page*size);
        query.take(size);
        
        const [result, count] = await query.getManyAndCount();
        
        return new Page<Ability>(result.map(i => {(i as any).type = this.entityClass.name; return i}), page, size, count);
    }
}