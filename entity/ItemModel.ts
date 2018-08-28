import {ItemType} from "../ItemType";
import {Column, Entity, JoinTable, ManyToMany} from "typeorm";
import {IsEnum, MaxLength, MinLength} from "class-validator";
import {DomainEntity} from "./DomainEntity";
import {Ability} from "./Ability";

@Entity()
export class ItemModel extends DomainEntity
{
    @IsEnum(ItemType)
    @Column()
    itemType:ItemType;
    
    @MinLength(1)
    @MaxLength(255)
    @Column()
    name:string;
    
    @Column()
    baseCost:number;
    
    @ManyToMany(type => Ability, ability => ability.itemModels)
    @JoinTable()
    abilities: Ability[];
    
    @Column({type:"int", default: "0"})
    baseCharges:number;
    
    constructor(id:number = 0, itemType:ItemType, name:string, baseCost:number = 0)
    {
        super();
        this.id = id;
        this.itemType = itemType;
        this.name = name;
        this.baseCost = baseCost;
    }
}