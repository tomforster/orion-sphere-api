import {ListView} from "./ListView";
import {ItemType} from "../../../ItemType";
import {IItemModel} from "../../../interfaces/IItemModel";
import * as m from "mithril";
import {ItemModelSearchPane} from "../components/ItemModelSearchPane";
import {ColumnHeader} from "../components/ColumnHeader";

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
    
    getColumns():ColumnHeader[]
    {
        return [new ColumnHeader("Name", "name"),
            new ColumnHeader("Item Type"),
            new ColumnHeader("Base Cost", "baseCost"),
            new ColumnHeader("Base Charges", "baseCharges")];
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