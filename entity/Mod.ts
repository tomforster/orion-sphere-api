import {DomainEntity} from "./DomainEntity";
import {Column, Entity, ManyToMany, ManyToOne, OneToMany} from "typeorm";
import {IsEnum, MaxLength, MinLength} from "class-validator";
import {ModType} from "../ModType";
import {Ability} from "./Ability";
import {Item} from "./Item";

@Entity()
export class Mod extends DomainEntity
{
    @MinLength(1)
    @MaxLength(255)
    @Column()
    name:string;
    
    @IsEnum(ModType)
    @Column()
    itemType:ModType;
    
    @ManyToOne(type => Ability, ability => ability.mods)
    ability:Ability;
    
    @ManyToMany(type => Item, item => item.mods)
    items:Item[];
}