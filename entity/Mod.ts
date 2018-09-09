import {DomainEntity} from "./DomainEntity";
import {Column, Entity, ManyToMany, ManyToOne} from "typeorm";
import {IsArray, MaxLength, MinLength} from "class-validator";
import {Ability} from "./Ability";
import {Item} from "./Item";
import {ItemType} from "../ItemType";
import {IMod} from "../interfaces/IMod";

@Entity()
export class Mod extends DomainEntity implements IMod
{
    @MinLength(1)
    @MaxLength(255)
    @Column()
    description:string;
    
    @ManyToOne(type => Ability, ability => ability.mods, {eager:true})
    ability:Ability;
    
    @ManyToMany(type => Item, item => item.mods)
    items:Item[];
    
    @Column({type: "int", default: "1"})
    maxStacks:number;
    
    @IsArray()
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
        }
        else
        {
            super();
        }
    }
}