import {DomainEntity} from "./DomainEntity";
import {Column, Entity, JoinTable, ManyToMany, ManyToOne} from "typeorm";
import {IsDefined, Max, MaxLength, Min, MinLength} from "class-validator";
import {Ability} from "./Ability";
import {IMod} from "../interfaces/IMod";
import {ItemMod} from "./ItemMod";
import {ItemType} from "./ItemType";

@Entity()
export class Mod extends DomainEntity implements IMod
{
    @MinLength(1, {always:true})
    @MaxLength(255, {always:true})
    @Column()
    description:string;
    
    @IsDefined({always:true})
    @ManyToOne(type => Ability, ability => ability.mods, {eager:true})
    ability:Ability;
    
    @ManyToOne(type => ItemMod, itemMod => itemMod.id)
    itemMods:ItemMod[];
    
    @Min(0, {always:true})
    @Max(999, {always:true})
    @Column({type: "int", default: "1"})
    maxStacks:number;
    
    @ManyToMany(type => ItemType, {eager: true})
    @JoinTable()
    restrictedTo:ItemType[];
    
    constructor(params?:IMod)
    {
        if(params)
        {
            super(params.id, params.version);
            this.description = params.description;
            this.maxStacks = params.maxStacks;
            this.restrictedTo = params.restrictedTo.map(rest => new ItemType(rest));
            this.ability = new Ability(params.ability);
        }
        else
        {
            super();
        }
    }
}