import {IDomainEntity} from "./IDomainEntity";
import {IAbility} from "./IAbility";
import {IItemType} from "./IItemType";

export interface IItemModel extends IDomainEntity
{
    itemType?: IItemType;
    name:string;
    baseCost?:number;
    abilities: IAbility[];
    baseCharges?:number;
}