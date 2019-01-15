import {Column, Entity, ManyToOne} from "typeorm";
import {Item} from "./Item";
import {Mod} from "./Mod";
import {IItemMod} from "../interfaces/IItemMod";
import {DomainEntity} from "./DomainEntity";
import {IsPositive, Min} from "class-validator";

@Entity()
export class ItemMod extends DomainEntity implements IItemMod
{
    @ManyToOne(type => Item, item => item.itemMods)
    item:Item;
    
    @ManyToOne(type => Mod, mod => mod.itemMods, {eager: true})
    mod:Mod;
    
    @IsPositive({groups: ["update"]})
    @Min(0)
    @Column()
    count:number;
    
    constructor(params?:IItemMod, item?:Item)
    {
        if(params)
        {
            super(params.id, params.version);
            this.item = item;
            this.mod = new Mod(params.mod);
            this.count = params.count;
        }
        else
        {
            super();
        }
    }
}