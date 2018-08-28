import {ItemType} from "../ItemType";
import {Page} from "../app";

export class ItemTypeService
{
    findAll():Promise<{key:string, name:string}[]>
    {
        return Promise.resolve(Object.keys(ItemType).map(key => {return {key, name:ItemType[key]}}));
    }
}