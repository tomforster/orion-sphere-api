import {ItemType} from "../ItemType";
import {Column, Entity, JoinTable, ManyToMany} from "typeorm";
import {IsDefined, IsEnum, IsNumber, Length} from "class-validator";
import {DomainEntity} from "./DomainEntity";
import {Ability} from "./Ability";
import {IItemModel} from "../interfaces/IItemModel";

@Entity()
export class ItemModel extends DomainEntity implements IItemModel
{
    @IsDefined({always:true})
    @IsEnum(ItemType)
    @Column()
    itemType:ItemType;
    
    @Length(1,255, {always:true})
    @Column()
    name:string;
    
    @IsNumber({}, {always:true})
    @Column()
    baseCost:number;
    
    @ManyToMany(type => Ability, ability => ability.itemModels)
    @JoinTable()
    abilities: Ability[];
    
    @IsNumber({}, {always:true})
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