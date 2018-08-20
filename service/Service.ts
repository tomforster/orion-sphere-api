import {getManager} from "typeorm";
import {Repository} from "typeorm/repository/Repository";
import {Page} from "../app";

export abstract class Service<T>
{
    entityClass:any;
    
    getRepository():Repository<T>
    {
        return getManager().getRepository(this.entityClass);
    }
    
    findAll(page:number, size:number):Promise<Page<T>>
    {
        return this.getRepository().find({skip:page*size, take:size})
            .then(res => new Page<T>(res, page, size));
    }
    
    findById(id:number):Promise<T>
    {
        if(!Service.validateId(id)) throw new Error("Invalid argument");
        return this.getRepository().findOne(id);
    }
    
    abstract create(entity:T):Promise<T>;
    
    abstract update(entity:T):Promise<T>;
    
    delete(id):Promise<boolean>
    {
        if(!Service.validateId(id)) throw new Error("Invalid argument");
        return this.getRepository().delete(id).then(result => {console.log(result); return true});
    }
    
    protected static validateId(id):boolean
    {
        return id && !isFinite(id) && id > 0;
    }
}