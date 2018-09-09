import {IDomainEntity} from "./IDomainEntity";
import {ItemType} from "../ItemType";
import {IAbility} from "./IAbility";

export interface IItemModel extends IDomainEntity
{
    itemType: ItemType;
    name:string;
    baseCost:number;
    abilities: IAbility[];
    baseCharges:number;
}