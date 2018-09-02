import {ListView} from "./ListView";
import {Item} from "../../../entity/Item";
import * as m from "mithril";
import {Vnode} from "mithril";
import {ItemType} from "../../../ItemType";

export class ItemListView extends ListView<Item>
{
    getColumns():string[]
    {
        return ["Serial", "Model", "Mods", "Type", "Maint. Cost", "+Mod Cost"];
    }
    
    getRowTemplate():(item:Item) => (number | string)[]
    {
        return (item:Item) => [item.serial, item.itemModel && item.itemModel.name || "", item.mods.length, item.itemModel && ItemType[<any>item.itemModel.itemType] || "", item.maintenanceCost, item.modCost];
    }
    
    getUrlPath():string
    {
        return "item";
    }
    
    getTitle():string
    {
        return "Items";
    }
    
    getControls():Vnode
    {
        return m(`a.button.level-item`, {href: `/lammie-html?ids=${this.selectedItems.map(i => i.id).join(",")}`,disabled: !this.selectedItems.length}, "Print Lammies");
    }
}