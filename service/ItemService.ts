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
    
    private generateSerial(item:Item):string
    {
        if(!item) return "";
        return item.itemModel.itemType + item.itemModel.id.toString().padStart(4, "0") + "-" + item.id.toString().padStart(4, "0");
    }

    private calculateUpkeep(item:Item):number
    {
        const modCost = item.mods.map(mod => mod.cost).reduce((a,b) => a + b, 0);

        return modCost + item.baseCost;
    }
}