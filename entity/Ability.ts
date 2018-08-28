import {MaxLength, MinLength} from "class-validator";
import {DomainEntity} from "./DomainEntity";
import {Column, Entity, OneToMany} from "typeorm";
import {Mod} from "./Mod";
import {ItemModel} from "./ItemModel";

@Entity()
export class Ability extends DomainEntity
{
    @MinLength(1)
    @MaxLength(255)
    @Column()
    name:string;
    
    @OneToMany(type => Mod, mod => mod.ability)
    mods:Mod[];
    
    @OneToMany(type => ItemModel, itemModel => itemModel.abilities)
    itemModels:ItemModel[];
}