import {IsPositive} from "class-validator";
import {
    AfterInsert,
    AfterRemove,
    AfterUpdate,
    CreateDateColumn,
    getManager,
    PrimaryGeneratedColumn,
    VersionColumn
} from "typeorm";
import {Audit} from "./Audit";
import {AuditType} from "../AuditType";
import {IDomainEntity} from "../interfaces/IDomainEntity";

export abstract class DomainEntity implements IDomainEntity
{
    @IsPositive({groups: ["update"]})
    @PrimaryGeneratedColumn()
    id:number;

    @CreateDateColumn()
    createdOn:number;
    
    @VersionColumn()
    version:number;
    
    constructor(id:number = 0, version = 0)
    {
        this.id = id;
        this.version = version;
    }
    
    @AfterInsert()
    afterInsert()
    {
        getManager().getRepository(Audit).insert(new Audit(AuditType.insert, this.constructor.name, this.id))
    }

    @AfterUpdate()
    afterUpdate()
    {
        getManager().getRepository(Audit).insert(new Audit(AuditType.update, this.constructor.name, this.id))
    }

    @AfterRemove()
    afterRemove()
    {
        getManager().getRepository(Audit).insert(new Audit(AuditType.delete, this.constructor.name, this.id))
    }
}