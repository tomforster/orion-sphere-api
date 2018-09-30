import {AfterLoad, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne} from "typeorm";
import {ItemModel} from "./ItemModel";
import {DomainEntity} from "./DomainEntity";
import {Mod} from "./Mod";
import {IItem} from "../interfaces/IItem";
import {IsArray, IsDefined, Length} from "class-validator";

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
    @ManyToMany(type => Mod, mod => mod.items, {eager:true})
    @JoinTable()
    mods:Mod[];
    
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
            this.mods = params.mods.map(mod => new Mod(mod));
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
        this.modCost = Math.round(multipliers[this.mods.length]*addModModifier*this.itemModel.baseCost);
        this.maintenanceCost = Math.round(multipliers[this.mods.length]*maintenanceModifier*this.itemModel.baseCost);
    }
}