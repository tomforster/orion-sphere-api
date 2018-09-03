import {ListView} from "./ListView";
import {Item} from "../../../entity/Item";
import * as m from "mithril";
import {Vnode} from "mithril";
import {ItemType} from "../../../ItemType";
import {ItemFilterOptions} from "../../../service/filters/ItemFilterOptions";

export class ItemListView extends ListView<Item, ItemFilterOptions>
{
    filterOptions:ItemFilterOptions = {s:"", itemModel:{s:"", name:"", itemType:""}, modIds:[]};
    
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
        return m(`a.button.level-item`, {href: `/lammie-html?ids=${this.selectedItems.map(i => i.id).join(",")}`, disabled: !this.selectedItems.length}, "Print Lammies");
    }
    
    getFilterControls():Vnode
    {
        return m(".field",
            m('.control',
                m(".select",
                    m(`select`, {onchange: m.withAttr("value", this.setItemTypeField.bind(this))},
                        [m('option'), ...Object.keys(ItemType).map(typeKey => m('option', {value: typeKey, selected: this.filterOptions.itemModel.itemType === typeKey}, ItemType[<any>typeKey]))]
                    )
                )
            )
        );
    }
    
    setItemTypeField(itemType:string):void
    {
        if(!itemType) itemType = "";
        this.filterOptions.itemModel.itemType = itemType;
    }
}