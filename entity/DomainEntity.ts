import {IsPositive} from "class-validator";
import {Column, CreateDateColumn, PrimaryGeneratedColumn, VersionColumn} from "typeorm";
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
    
    @Column({default: false})
    deleted:boolean;
    
    constructor(id:number = 0, version = 0)
    {
        this.id = id;
        this.version = version;
        this.deleted = false;
    }
}