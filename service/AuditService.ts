import {Audit} from "../entity/Audit";
import {getManager} from "typeorm";
import {Service} from "./Service";
import {Page} from "../Page";
import {FilterOptions} from "./filters/FilterOptions";

export class AuditService
{
    async findByEntityId(type:string, id:number, filterOptions:FilterOptions):Promise<Page<Audit>>
    {
        const {page, size} = filterOptions;
        if(!Service.validateId(id)) throw new Error("Invalid argument");
        
        let where = {};
        switch(type)
        {
            case "item": where["itemId"] = id; break;
            case "mod": where["modId"] = id; break;
            case "item-model": where["itemModelId"] = id; break;
            case "ability": where["abilityId"] = id; break;
            default: throw new Error("Invalid argument");
        }
        
        const result = (await getManager().getRepository(Audit)
            .findAndCount({skip: page * size, take: size, order: {id: "DESC"}, where}));
        
        const count = result[1];
        const audits = result[0];
        
        return new Page<Audit>(audits, page, size, count);
    }
}
