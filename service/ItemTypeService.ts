import {ItemType} from "../ItemType";

export class ItemTypeService
{
    findAll(params: {offset:number, limit:number}):Promise<{id:number, name:string}[]>
    {
        return Promise.resolve(Object.keys(ItemType).map(key => {return {id:Number(key), name:ItemType[key]}}));
    }
}