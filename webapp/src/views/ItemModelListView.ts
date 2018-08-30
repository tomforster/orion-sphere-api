import {ListView} from "./ListView";
import {ItemModel} from "../index";

export class ItemModelListView extends ListView<ItemModel>
{
    getColumns():string[]
    {
        return ["Item Type", "Name", "Base Cost"];
    }
    
    getRowTemplate():(item:ItemModel) => (number | string)[]
    {
        return (item:ItemModel) => [this.getItemType(item.itemType) || "", item.name, item.baseCost];
    }
    
    getUrlPath():string
    {
        return "item-model";
    }
    
    getTitle():string
    {
        return "Models";
    }
}