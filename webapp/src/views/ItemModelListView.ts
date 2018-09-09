import {ListView} from "./ListView";
import {ItemType} from "../../../ItemType";
import {ItemModelFilterOptions} from "../../../service/filters/ItemModelFilterOptions";
import {IItemModel} from "../../../interfaces/IItemModel";

export class ItemModelListView extends ListView<IItemModel, ItemModelFilterOptions>
{
    filterOptions = {s:"", itemType:"", name:""};
    
    getColumns():string[]
    {
        return ["Item Type", "Name", "Base Cost"];
    }
    
    getRowTemplate():(item:IItemModel) => (number | string)[]
    {
        return (item:IItemModel) => [ItemType[<any>item.itemType] || "", item.name, item.baseCost];
    }
    
    getUrlPath():string
    {
        return "item-models";
    }
    
    getTitle():string
    {
        return "Models";
    }
}