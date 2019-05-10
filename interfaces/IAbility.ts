import {IDomainEntity} from "./IDomainEntity";
import {IMod} from "./IMod";
import {IItemModel} from "./IItemModel";

export interface IAbility extends IDomainEntity
{
    description:string;
    mods?:IMod[];
    itemModels?:IItemModel[];
    chargeCost?:number;
    hideOnLammie?:boolean;
}