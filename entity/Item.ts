import {AfterLoad, Column, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";
import {ItemModel} from "./ItemModel";
import {DomainEntity} from "./DomainEntity";
import {IItem} from "../interfaces/IItem";
import {IsArray, IsDefined, IsPositive, Length} from "class-validator";
import {ItemMod} from "./ItemMod";

// const multipliers = [1, 1.2, 1.6, 2.2, 3.2, 4.8, 7.4, 11.6, 18.4, 29.4, 47.2];
export const maintenanceModifier = 0.1;
export const addModModifier = 0.5;

@Entity()
export class Item extends DomainEntity implements IItem
{
    @IsDefined({always: true})
    @ManyToOne(type => ItemModel, "itemModel", {eager: true})
    @JoinColumn()
    itemModel:ItemModel;
    
    @IsArray({always: true})
    @OneToMany(type => ItemMod, itemMod => itemMod.item, {eager:true})
    itemMods:ItemMod[];
    
    @Length(10,12, ({groups: ["update"]}))
    @Column()
    serial:string;

    @IsPositive()
    @Column({default: 1, type: "real"})
    modCost:number;
    
    @IsPositive()
    @Column({default: 1, type: "real"})
    maintenanceCost:number;
    
    constructor(params?:IItem)
    {
        if(params)
        {
            super(params.id, params.version);
            this.itemModel = params.itemModel ? new ItemModel(params.itemModel) : undefined;
            this.itemMods = params.itemMods.map(itemMod => new ItemMod(itemMod, this));
            this.serial = params.serial;
            
            this.setCosts();
        }
        else
        {
            super();
        }
    }
    
    @AfterLoad()
    setCosts()
    {
        const numMods = this.itemMods.reduce((acc, mod) => acc + mod.count,0);
        
        const costMultiplier = getMultiplier(numMods);
        this.modCost = Math.round(costMultiplier*addModModifier*this.itemModel.baseCost);
        this.maintenanceCost = Math.round(costMultiplier*maintenanceModifier*this.itemModel.baseCost);
    }
}

const multiplierCache = [];

export function getMultiplier(currentNumMods:number)
{
    if(multiplierCache[currentNumMods]) return multiplierCache[currentNumMods];
    
    if(!currentNumMods) return 1;
    if(currentNumMods === 1) return 1.2;
    if(currentNumMods === 2) return 1.6;
    
    return multiplierCache[currentNumMods] = Math.round((2*getMultiplier(currentNumMods - 1) - getMultiplier(currentNumMods - 3)) * 100) / 100;
}