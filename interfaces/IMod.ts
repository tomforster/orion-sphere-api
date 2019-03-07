import {IDomainEntity} from "./IDomainEntity";
import {IAbility} from "./IAbility";
import {IItemType} from "./IItemType";

export interface IMod extends IDomainEntity
{
    description:string;
    ability?:IAbility;
    maxStacks?:number;
    restrictedTo:IItemType[];
}