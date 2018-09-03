import {ListView} from "./ListView";
import {ItemModel} from "../../../entity/ItemModel";
import {ItemType} from "../../../ItemType";
import {ItemModelFilterOptions} from "../../../service/filters/ItemModelFilterOptions";

export class ItemModelListView extends ListView<ItemModel, ItemModelFilterOptions>
{
    filterOptions = {s:"", itemType:"", name:""};
    
    getColumns():string[]
    {
        return ["Item Type", "Name", "Base Cost"];
    }
    
    getRowTemplate():(item:ItemModel) => (number | string)[]
    {
        return (item:ItemModel) => [ItemType[<any>item.itemType] || "", item.name, item.baseCost];
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