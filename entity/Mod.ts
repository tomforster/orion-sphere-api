import {DomainEntity} from "./DomainEntity";
import {Column, Entity, ManyToOne} from "typeorm";
import {IsArray, IsDefined, Max, MaxLength, Min, MinLength} from "class-validator";
import {Ability} from "./Ability";
import {ItemType} from "../ItemType";
import {IMod} from "../interfaces/IMod";
import {ItemMod} from "./ItemMod";

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
    
    @IsArray({always:true})
    @Column("simple-array")
    restrictedTo:ItemType[];
    
    constructor(params?:IMod)
    {
        if(params)
        {
            super(params.id, params.version);
            this.description = params.description;
            this.maxStacks = params.maxStacks;
            this.restrictedTo = params.restrictedTo;
            this.ability = new Ability(params.ability);
        }
        else
        {
            super();
        }
    }
}