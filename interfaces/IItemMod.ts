import {IMod} from "./IMod";
import {IDomainEntity} from "./IDomainEntity";

export interface IItemMod extends IDomainEntity
{
    // item:IItem;
    mod:IMod;
    count:number;
}