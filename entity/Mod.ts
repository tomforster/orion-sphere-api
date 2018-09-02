import {DomainEntity} from "./DomainEntity";
import {Column, Entity, ManyToMany, ManyToOne} from "typeorm";
import {IsArray, MaxLength, MinLength} from "class-validator";
import {Ability} from "./Ability";
import {Item} from "./Item";
import {ItemType} from "../ItemType";

@Entity()
export class Mod extends DomainEntity
{
    @MinLength(1)
    @MaxLength(255)
    @Column()
    description:string;
    
    @ManyToOne(type => Ability, ability => ability.mods)
    ability:Ability;
    
    @ManyToMany(type => Item, item => item.mods)
    items:Item[];
    
    @Column({type: "int", default: "1"})
    maxStacks:number;
    
    @IsArray()
    @Column("simple-array")
    restrictedTo:ItemType[];
}