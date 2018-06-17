import {ItemType} from "../ItemType";
import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";
import {IsEnum, IsPositive, MaxLength, MinLength} from "class-validator";

@Entity()
export class ItemDefinition
{
    @IsPositive()
    @PrimaryGeneratedColumn()
    id:number;
    
    @IsEnum(ItemType)
    @Column()
    itemType:ItemType;
    
    @MinLength(1)
    @MaxLength(255)
    @Column()
    name:string;
    
    constructor(id:number = 0, itemType:ItemType, name:string)
    {
        this.id = id;
        this.itemType = itemType;
        this.name = name;
    }
}