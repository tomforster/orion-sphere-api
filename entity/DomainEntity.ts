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

export abstract class DomainEntity
{
    @IsPositive()
    @PrimaryGeneratedColumn()
    id:number;

    @CreateDateColumn()
    createdOn:number;
    
    @VersionColumn()
    version:number;
    
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