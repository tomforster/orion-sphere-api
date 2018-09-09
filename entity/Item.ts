import {AfterLoad, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne} from "typeorm";
import {ItemModel} from "./ItemModel";
import {DomainEntity} from "./DomainEntity";
import {Mod} from "./Mod";

@Entity()
export class Item extends DomainEntity
{
    @ManyToOne(type => ItemModel, "itemModel", {eager: true})
    @JoinColumn()
    itemModel:ItemModel;
    
    @ManyToMany(type => Mod, mod => mod.items, {eager:true})
    @JoinTable()
    mods:Mod[];
    
    @Column()
    serial:string;

    maintenanceCost:number;
    modCost:number;
    
    constructor(id:number = 0, itemModel:ItemModel)
    {
        super();
        this.id = id;
        this.itemModel = itemModel;
    }
    
    readonly multipliers = [1, 1.2, 1.6, 2.2, 3.2, 4.8, 7.4, 11.6, 18.4, 29.4, 47.2];
    readonly maintenanceModifier = 0.1;
    readonly addModModifier = 0.5;
    
    @AfterLoad()
    setCosts()
    {
        this.modCost = Math.round(this.multipliers[this.mods.length]*this.addModModifier*this.itemModel.baseCost);
        this.maintenanceCost = Math.round(this.multipliers[this.mods.length]*this.maintenanceModifier*this.itemModel.baseCost);
    }
}