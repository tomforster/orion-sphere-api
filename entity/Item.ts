import {Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne} from "typeorm";
import {ItemModel} from "./ItemModel";
import {DomainEntity} from "./DomainEntity";
import {Mod} from "./Mod";

@Entity()
export class Item extends DomainEntity
{
    @ManyToOne(type => ItemModel, "itemModel", {eager: true})
    @JoinColumn()
    itemModel:ItemModel;
    
    @ManyToMany(type => Mod, mod => mod.items)
    @JoinTable()
    mods:Mod[];
    
    serial:string;
    
    constructor(id:number = 0, itemModel:ItemModel)
    {
        super();
        this.id = id;
        this.itemModel = itemModel;
    }
}