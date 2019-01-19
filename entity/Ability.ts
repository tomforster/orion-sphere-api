import {IsPositive, Max, MaxLength, MinLength} from "class-validator";
import {DomainEntity} from "./DomainEntity";
import {Column, Entity, OneToMany} from "typeorm";
import {Mod} from "./Mod";
import {ItemModel} from "./ItemModel";
import {IAbility} from "../interfaces/IAbility";

@Entity()
export class Ability extends DomainEntity implements IAbility
{
    @MinLength(1, {always:true})
    @MaxLength(255, {always:true})
    @Column()
    description:string;
    
    @OneToMany(type => Mod, mod => mod.ability)
    mods:Mod[];
    
    @OneToMany(type => ItemModel, itemModel => itemModel.abilities)
    itemModels:ItemModel[];
    
    @IsPositive({always:true})
    @Max(999, {always:true})
    @Column({type: "int", default: "0"})
    chargeCost:number;
    
    constructor(params?:IAbility)
    {
        if(params)
        {
            super(params.id, params.version);
            this.description = params.description;
            this.chargeCost = params.chargeCost;
        }
        else
        {
            super();
        }
    }
}