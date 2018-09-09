import {Audit} from "../entity/Audit";
import {getManager} from "typeorm";
import {Service} from "./Service";
import {Page} from "../Page";

export class AuditService
{
    async findByEntityId(type:string, id:number, page:number, size:number):Promise<Page<Audit>>
    {
        if(!Service.validateId(id)) throw new Error("Invalid argument");
        
        let where = {};
        switch(type)
        {
            case "item": where["itemId"] = id; break;
            default: throw new Error("Invalid argument");
        }
        
        const result = (await getManager().getRepository(Audit)
            .findAndCount({skip: page * size, take: size, order: {id: "DESC"}, where}));
        
        const count = result[1];
        const audits = result[0];
        
        return new Page<Audit>(audits, page, size, count);
    }
}
