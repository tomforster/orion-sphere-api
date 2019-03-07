import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";
import {IsEnum, IsPositive} from "class-validator";
import {AuditType} from "../AuditType";
import {IAudit} from "../interfaces/IAudit";

@Entity()
export class Audit implements IAudit
{
    @IsPositive()
    @PrimaryGeneratedColumn()
    id:number;
    
    @IsEnum(AuditType)
    @Column()
    auditType:AuditType;
    
    @CreateDateColumn()
    createdOn:number;
    
    @Column({nullable: true})
    itemId:number;
    
    @Column({nullable: true})
    itemModelId:number;
    
    @Column({nullable: true})
    modId:number;
    
    @Column({nullable: true})
    abilityId:number;
    
    @Column({nullable: true})
    description:string;
    
    @Column({nullable: true})
    oldValue:string;
    
    @Column({nullable: true})
    newValue:string;
    
    constructor(auditType:AuditType, entityType:string, id:number, description?:string, oldValue?:string, newValue?:string)
    {
        this.auditType = auditType;
        
        switch (entityType)
        {
            case "Item": this.itemId = id; break;
            case "ItemModel": this.itemModelId = id; break;
            case "Mod": this.modId = id; break;
            case "Ability": this.abilityId = id; break;
        }
        
        this.description = description;
        this.oldValue = oldValue;
        this.newValue = newValue;
    }
}