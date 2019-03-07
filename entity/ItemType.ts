import {DomainEntity} from "./DomainEntity";
import {IItemType} from "../interfaces/IItemType";
import {Column, Entity} from "typeorm";

@Entity()
export class ItemType extends DomainEntity implements IItemType
{
    @Column({unique:true})
    name:string;
    
    @Column({unique:true})
    code:string;
    
    constructor(params?:IItemType)
    {
        if(params)
        {
            super(params.id, params.version);
            this.name = params.name;
            this.code = params.code;
        }
        else
        {
            super();
        }
    }
    
}