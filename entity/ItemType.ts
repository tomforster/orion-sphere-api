import {DomainEntity} from "./DomainEntity";
import {IItemType} from "../interfaces/IItemType";
import {Column, Entity} from "typeorm";

@Entity()
export class ItemType extends DomainEntity implements IItemType
{
    @Column()
    name:string;
    
    constructor(params?:IItemType)
    {
        if(params)
        {
            super(params.id, params.version);
            this.name = params.name
        }
        else
        {
            super();
        }
    }
    
}