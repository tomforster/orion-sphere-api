import {Item} from "../entity/Item";
import {Service} from "./Service";
import {ItemDefinition} from "../entity/ItemDefinition";
import {validate} from "class-validator";

export class ItemService extends Service<Item>
{
    entityClass:any = Item;
    
    create(params:Item):Promise<Item>
    {
        const entity = new Item(undefined, params.itemDefinition);
        if(!validate(entity)) throw new Error("Invalid Argument");
        return this.getRepository().save(entity);
    }
    
    update(params:Item):Promise<Item>
    {
        const entity = new Item(params.id, params.itemDefinition);
        if(!validate(entity)) throw new Error("Invalid Argument");
        return this.getRepository().save(entity);
    }
}