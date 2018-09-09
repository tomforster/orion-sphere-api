import {ItemType} from "../ItemType";
import {Column, Entity, JoinTable, ManyToMany} from "typeorm";
import {IsEnum, MaxLength, MinLength} from "class-validator";
import {DomainEntity} from "./DomainEntity";
import {Ability} from "./Ability";
import {IItemModel} from "../interfaces/IItemModel";

@Entity()
export class ItemModel extends DomainEntity implements IItemModel
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
    
    constructor(params?:IItemModel)
    {
        if(params)
        {
            super(params.id, params.version);
            this.itemType = params.itemType;
            this.name = params.name;
            this.baseCost = params.baseCost;
            this.baseCharges = params.baseCharges;
        }
        else
        {
            super();
        }
    }
}