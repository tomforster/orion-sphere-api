import {ItemType} from "../ItemType";
import {Page} from "../app";

export class ItemTypeService
{
    findAll(page:number, size:number):Promise<Page<{id:number, name:string}>>
    {
        return Promise.resolve(Object.keys(ItemType).map(key => {return {id:Number(key), name:ItemType[key]}}))
            .then(res => new Page<{id:number, name:string}>(res, page, size));
    }
}