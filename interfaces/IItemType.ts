import {IDomainEntity} from "./IDomainEntity";

export interface IItemType extends IDomainEntity
{
    name:string;
    code:string;
}