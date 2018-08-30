import {ListView} from "./ListView";
import {Item} from "../index";
import * as m from "mithril";
import {Vnode} from "mithril";

export class ItemListView extends ListView<Item>
{
    getColumns():string[]
    {
        return ["Serial", "Model", "Mods", "Type"];
    }
    
    getRowTemplate():(item:Item) => (number | string)[]
    {
        return (item:Item) => [item.serial, item.itemModel && item.itemModel.name || "", 0, item.itemModel && this.getItemType(item.itemModel.itemType) || ""];
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