import {IDomainEntity} from "./IDomainEntity";
import {IAbility} from "./IAbility";
import {ItemType} from "../ItemType";
import {IItem} from "./IItem";

export interface IMod extends IDomainEntity
{
    description:string;
    ability:IAbility;
    items:IItem[];
    maxStacks:number;
    restrictedTo:ItemType[];
}