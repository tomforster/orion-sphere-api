import {IMod} from "./IMod";
import {IItemModel} from "./IItemModel";
import {IDomainEntity} from "./IDomainEntity";

export interface IItem extends IDomainEntity
{
    itemModel?:IItemModel;
    mods:IMod[];
    serial?:string;
    maintenanceCost?:number;
    modCost?:number;
}