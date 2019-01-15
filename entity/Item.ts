import {AfterLoad, Column, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";
import {ItemModel} from "./ItemModel";
import {DomainEntity} from "./DomainEntity";
import {IItem} from "../interfaces/IItem";
import {IsArray, IsDefined, Length} from "class-validator";
import {ItemMod} from "./ItemMod";

const multipliers = [1, 1.2, 1.6, 2.2, 3.2, 4.8, 7.4, 11.6, 18.4, 29.4, 47.2];
const maintenanceModifier = 0.1;
const addModModifier = 0.5;

@Entity()
export class Item extends DomainEntity implements IItem
{
    @IsDefined({always: true})
    @ManyToOne(type => ItemModel, "itemModel", {eager: true})
    @JoinColumn()
    itemModel:ItemModel;
    
    @IsArray({always: true})
    @OneToMany(type => ItemMod, itemMod => itemMod.item, {eager:true, cascade:true})
    itemMods:ItemMod[];
    
    @Length(10,12, ({groups: ["update"]}))
    @Column()
    serial:string;

    maintenanceCost:number;
    modCost:number;
    
    constructor(params?:IItem)
    {
        if(params)
        {
            super(params.id, params.version);
            this.itemModel = params.itemModel ? new ItemModel(params.itemModel) : undefined;
            this.itemMods = params.itemMods.map(itemMod => new ItemMod(itemMod, this));
            this.serial = params.serial;
        }
        else
        {
            super();
        }
    }
    
    @AfterLoad()
    setCosts()
    {
        //todo: fix this
        const numMods = this.itemMods.reduce((acc, mod) => acc + mod.count,0);
        this.modCost = Math.round(multipliers[numMods]*addModModifier*this.itemModel.baseCost);
        this.maintenanceCost = Math.round(multipliers[numMods]*maintenanceModifier*this.itemModel.baseCost);
    }
}