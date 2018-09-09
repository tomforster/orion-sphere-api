import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";
import {IsEnum, IsPositive} from "class-validator";
import {AuditType} from "../AuditType";

@Entity()
export class Audit
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
    
    constructor(auditType:AuditType, entityType:string, id:number)
    {
        this.auditType = auditType;
        
        switch (entityType)
        {
            case "item": this.itemId = id; break;
            case "itemModel": this.itemModelId = id; break;
            case "mod": this.modId = id; break;
            case "ability": this.abilityId = id; break;
        }
    }
}