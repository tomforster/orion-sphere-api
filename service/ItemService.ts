import {Item} from "../entity/Item";
import {Service} from "./Service";
import {validate} from "class-validator";
import {Page} from "../app";

export class ItemService extends Service<Item>
{
    entityClass:any = Item;
    
    create(params:Item):Promise<Item>
    {
        const entity = new Item(undefined, params.itemModel);
        if(!validate(entity)) throw new Error("Invalid Argument");
        return this.getRepository().save(entity);
    }
    
    update(params:Item):Promise<Item>
    {
        const entity = new Item(params.id, params.itemModel);
        if(!validate(entity)) throw new Error("Invalid Argument");
        return this.getRepository().save(entity);
    }
    
    async findAll(page:number, size:number):Promise<Page<Item>>
    {
        const result:Page<Item> = await super.findAll(page, size);
        result.content.forEach(c => c.serial = this.generateSerial(c));
        return result;
    }
    
    
    async findByIds(ids:number[]):Promise<Item[]>
    {
        const result = await super.findByIds(ids);
        result.forEach(i => i.serial = this.generateSerial(i));
        return result;
    }
    
    private generateSerial(item:Item):string
    {
        if(!item) return "";
        return item.itemModel.itemType + item.itemModel.id.toString().padStart(4, "0") + "-" + item.id.toString().padStart(4, "0");
    }
}