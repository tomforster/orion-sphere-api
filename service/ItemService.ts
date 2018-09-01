import {Item} from "../entity/Item";
import {Service} from "./Service";
import {validate} from "class-validator";
import {Page} from "../app";

export class ItemService extends Service<Item>
{
    entityClass:any = Item;
    readonly multipliers = [1, 1.2, 1.6, 2.2, 3.2, 4.8, 7.4, 11.6, 18.4, 29.4, 47.2];
    readonly maintainanceModifier = 0.1;
    readonly addModModifier = 0.5;
    
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
    
    protected applyTransforms(item:Item):Item
    {
        item.modCost = this.multipliers[item.mods.length]*this.addModModifier*item.itemModel.baseCost;
        item.maintenanceCost = this.multipliers[item.mods.length]*this.maintainanceModifier*item.itemModel.baseCost;
        return item;
    }
}