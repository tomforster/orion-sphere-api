import {getManager, Like} from "typeorm";
import {Repository} from "typeorm/repository/Repository";
import {Page} from "../app";
import {DomainEntity} from "../entity/DomainEntity";

export abstract class Service<T extends DomainEntity>
{
    abstract entityClass:any;
    
    protected getRepository():Repository<T>
    {
        return getManager().getRepository(this.entityClass);
    }
    
    protected searchFields():string[]
    {
        return [];
    }
    
    private where(searchString:string):any
    {
        if(!searchString || !searchString.length || !this.searchFields()) return undefined;
        const whereClause = {};
        this.searchFields().forEach(field => {
            whereClause[field] = Like(`%${searchString}%`);
        });
        return whereClause;
    }
    
    async findAll(page:number, size:number, searchString:string):Promise<Page<T>>
    {
        const result = (await this.getRepository()
            .find({skip:page*size, take:size, where:this.where(searchString)}))
            .map(r => this.applyTransforms(r));
        const count = await this.getRepository().count();
        return new Page<T>(result.map(i => {(i as any).type = this.entityClass.name; return i}), page, size, count);
    }
    
    async findById(id:number):Promise<T>
    {
        if(!Service.validateId(id)) throw new Error("Invalid argument");
        return this.applyTransforms(await this.getRepository().findOne(id));
    }
    
    async findByIds(ids:number[]):Promise<T[]>
    {
        if (ids.map(id => Service.validateId(id)).some(res => !res)) throw new Error("Invalid argument");
        const result = await this.getRepository().findByIds(ids);
        return result.map(r => this.applyTransforms(r));
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
        return id && isFinite(id) && id > 0;
    }
    
    protected applyTransforms(entity:T):T
    {
        return entity;
    }
}