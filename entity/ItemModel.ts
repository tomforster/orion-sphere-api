import {Column, Entity, JoinTable, ManyToMany, ManyToOne} from "typeorm";
import {IsDefined, Length, Min} from "class-validator";
import {DomainEntity} from "./DomainEntity";
import {Ability} from "./Ability";
import {IItemModel} from "../interfaces/IItemModel";
import {ItemType} from "./ItemType";

@Entity()
export class ItemModel extends DomainEntity implements IItemModel
{
    @IsDefined({always:true})
    @ManyToOne(type => ItemType, {eager: true})
    itemType:ItemType;
    
    @Length(1,255, {always:true})
    @Column()
    name:string;
    
    @Min(0, {always:true})
    @Column({default: 0})
    baseCost:number;
    
    @ManyToMany(type => Ability, ability => ability.itemModels, {eager: true})
    @JoinTable()
    abilities: Ability[];
    
    @Min(0, {always:true})
    @Column({type:"int", default: 0})
    baseCharges:number;
    
    constructor(params?:IItemModel)
    {
        if(params)
        {
            super(params.id, params.version);
            this.itemType = params.itemType ? new ItemType(params.itemType) : undefined;
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