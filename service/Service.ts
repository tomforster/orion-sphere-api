import {EntitySubscriberInterface, getManager, InsertEvent, SelectQueryBuilder, UpdateEvent} from "typeorm";
import {Repository} from "typeorm/repository/Repository";
import {DomainEntity} from "../entity/DomainEntity";
import {FilterOptions} from "./filters/FilterOptions";
import {Page} from "./filters/Page";
import {validateOrReject} from "class-validator";
import {IDomainEntity} from "../interfaces/IDomainEntity";
import {Pageable} from "./filters/Pageable";
import {SortField} from "./filters/SortField";

export abstract class Service<T extends DomainEntity, F extends FilterOptions> implements EntitySubscriberInterface
{
    abstract entityClass:any;
    allowedSortFields = ["id"];
    
    listenTo()
    {
        return this.entityClass;
    }
    
    /**
     * Called before entity insertion.
     */
    async beforeInsert(event:InsertEvent<any>)
    {
        console.debug(`BEFORE ENTITY INSERTED: `, event.entity);
    }
    
    async beforeUpdate(event:UpdateEvent<any>)
    {
        const entity = event.entity;
        console.log(`Updated ${entity.id}`);
        console.log(event.updatedColumns.map(col => `Set field ${col.propertyName} to ${entity[col.propertyName]}`));
    }
    
    protected getRepository():Repository<T>
    {
        return getManager().getRepository(this.entityClass);
    }
    
    async findAll(pageable:Pageable, filterOptions?:F):Promise<Page<T>>
    {
        let result, count:number;
        const sort = this.getSort(pageable);
        if(this.getFindQuery)
        {
            const query = this.getFindQuery(filterOptions);
            query.skip(pageable.page * pageable.size);
            query.take(pageable.size);
            const tableName = this.getRepository().metadata.tableName;
            query.orderBy(sort.field.indexOf(".") < 0 ? tableName + "." + sort.field : sort.field, sort.direction);
    
            [result, count] = await query.getManyAndCount();
        }
        else
        {
            result = await this.getRepository().find({skip: pageable.page * pageable.size, take: pageable.size});
            count = await this.getRepository().count();
        }
        return new Page<T>(result.map(i => {(i as any).type = this.entityClass.name; return i}), pageable.page, pageable.size, count, sort);
    }
    
    getSort(pageable:Pageable):SortField
    {
        if (pageable.sort && pageable.sort.field && this.allowedSortFields.indexOf(pageable.sort.field) > -1)
        {
            return pageable.sort;
        }
        else
        {
            return {field: "id", direction: "DESC"};
        }
    }
    
    getFindQuery:(filterOptions?:F) => SelectQueryBuilder<T>;
    
    async findById(id:number):Promise<T>
    {
        if(!Service.validateId(id)) throw new Error("Invalid argument");
        return await this.getRepository().findOne(id);
    }
    
    async findByIds(ids:number[]):Promise<T[]>
    {
        if (ids.map(id => Service.validateId(id)).some(res => !res)) throw new Error("Invalid argument");
        return await this.getRepository().findByIds(ids);
    }
    
    async create(params:IDomainEntity):Promise<T>
    {
        const entity = new this.entityClass(Object.assign(params, {id:undefined}));
        await validateOrReject(entity, {groups: ["create"], validationError:{target:false}});
        return this.getRepository().save(entity);
    }
    
    async update(params:IDomainEntity):Promise<T>
    {
        const entity = new this.entityClass(params);
        await validateOrReject(entity, {groups: ["update"], validationError:{target:false}});
        return this.getRepository().save(entity);
    }
    
    async delete(id):Promise<boolean>
    {
        if(!Service.validateId(id)) throw new Error("Invalid argument");

        const entity = await this.getRepository().findOne(id);
        if(entity)
        {
            entity.deleted = true;
            return this.getRepository().save(entity as any).then(result => true);
        }
        return false;
    }
    
    static validateId(id):boolean
    {
        return id && isFinite(id) && id > 0;
    }
}