import {ListView} from "./ListView";
import {ItemType} from "../../../ItemType";
import {IItemModel} from "../../../interfaces/IItemModel";
import * as m from "mithril";
import {ItemModelSearchPane} from "../components/ItemModelSearchPane";

export class ItemModelListView extends ListView<IItemModel>
{
    getCreateUrl():string
    {
        return "/item-model/create"
    }
    
    getSearchPane()
    {
        return new ItemModelSearchPane(this.onSearchChange.bind(this));
    }
    
    getColumns():string[]
    {
        return ["Name", "Item Type", "Base Cost", "Base Charges"];
    }
    
    getRowData(itemModel:IItemModel)
    {
        return [m("td", m(`a[href=/item-model/${itemModel.id}]`, {oncreate: m.route.link}, itemModel.name)), m("td", ItemType[<any>itemModel.itemType] || ""), m("td", itemModel.baseCost), m("td", itemModel.baseCharges)];
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