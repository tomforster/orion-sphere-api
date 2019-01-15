import {IDomainEntity} from "./IDomainEntity";
import {IAbility} from "./IAbility";
import {ItemType} from "../ItemType";

export interface IMod extends IDomainEntity
{
    description:string;
    ability?:IAbility;
    // itemMods?:IItemMod[];
    maxStacks?:number;
    restrictedTo:ItemType[];
}