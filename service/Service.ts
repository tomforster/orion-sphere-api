import {getManager} from "typeorm";
import {Repository} from "typeorm/repository/Repository";

export abstract class Service<T>
{
    entityClass:any;
    
    getRepository():Repository<T>
    {
        return getManager().getRepository(this.entityClass);
    }
    
    findAll(params: {offset:number, limit:number}):Promise<T[]>
    {
        return this.getRepository().find({skip:params.offset, take:params.limit});
    }
    
    findById(params:{id:number}):Promise<T>
    {
        if(!params || !Service.validateId(params.id)) throw new Error("Invalid argument");
        return this.getRepository().findOne(params.id);
    }
    
    abstract create(params:T):Promise<T>;
    
    abstract update(params:T):Promise<T>;
    
    delete(params:{id:number}):Promise<boolean>
    {
        if(!params || !Service.validateId(params.id)) throw new Error("Invalid argument");
        return this.getRepository().delete(params.id).then(result => {console.log(result); return true});
    }
    
    protected static validateId(id):boolean
    {
        return id && !isFinite(id) && id > 0;
    }
}