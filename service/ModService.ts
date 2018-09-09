import {Mod} from "../entity/Mod";
import {Service} from "./Service";
import {Brackets} from "typeorm";
import {Page} from "../Page";
import {ModFilterOptions} from "./filters/ModFilterOptions";
import {validate} from "class-validator";
import {IMod} from "../interfaces/IMod";

export class ModService extends Service<Mod>
{
    entityClass:any = Mod;
    
    async findAll(page:number, size:number, filterOptions:ModFilterOptions):Promise<Page<Mod>>
    {
        let query = this.getRepository()
            .createQueryBuilder("mod")
            .leftJoinAndSelect("mod.ability", "ability")
            .where("1=1");
        
        if(filterOptions.s)
        {
            const s = "%" + filterOptions.s + "%";
            query = query.andWhere(new Brackets(qb => {
                qb.where("LOWER(mod.description) like LOWER(:s)", {s})
            }));
        }
        
        query.skip(page*size);
        query.take(size);
        
        const [result, count] = await query.getManyAndCount();
        
        return new Page<Mod>(result.map(i => {(i as any).type = this.entityClass.name; return i}), page, size, count);
    }
    
    create(entity:Mod):Promise<Mod>
    {
        return null;
    }
    
    async update(params:IMod):Promise<Mod>
    {
        const entity = new Mod(params);
        if(!validate(entity)) throw new Error("Invalid Argument");
        return this.getRepository().save(entity);
    }
}