import {IItemModel} from "./IItemModel";
import {IDomainEntity} from "./IDomainEntity";
import {IItemMod} from "./IItemMod";

export interface IItem extends IDomainEntity
{
    itemModel?:IItemModel;
    itemMods:IItemMod[];
    serial?:string;
    maintenanceCost?:number;
    modCost?:number;
}