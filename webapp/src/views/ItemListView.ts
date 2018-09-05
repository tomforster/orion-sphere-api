import {ListView} from "./ListView";
import {Item} from "../../../entity/Item";
import * as m from "mithril";
import {Vnode} from "mithril";
import {ItemType} from "../../../ItemType";
import {ItemFilterOptions} from "../../../service/filters/ItemFilterOptions";

export class ItemListView extends ListView<Item, ItemFilterOptions>
{
    filterOptions:ItemFilterOptions = {s:"", itemModel:{s:"", name:"", itemType:""}, modIds:[]};
    expandable = true;
    
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
    
    getFilterControls():Vnode[]
    {   const fields = [];
        fields.push(m(".field", [
            m('.control.is-expanded', m("input.input[type='text']", {value: this.filterOptions.s, placeholder: 'Filter on model or serial...', oninput: m.withAttr("value", this.setSearchField.bind(this))})),
        ]));
        fields.push(m(".field.is-horizontal", m(".field-body",
            [
                m(".field",
                    m('.control',
                        m(".select",
                            m(`select`, {onchange: m.withAttr("value", this.setItemTypeField.bind(this))},
                                [m('option'), ...Object.keys(ItemType).map(typeKey => m('option', {value: typeKey, selected: this.filterOptions.itemModel.itemType === typeKey}, ItemType[<any>typeKey]))]
                            )
                        )
                    )
                ),
                m(".field",
                    m(".control.has-text-right",
                        m("a.button.is-primary", {onclick: this.onSearchPressed.bind(this)}, "Search")
                    )
                )
            ]
        )));
        return fields;
    }
    
    setItemTypeField(itemType:string):void
    {
        if(!itemType) itemType = "";
        this.filterOptions.itemModel.itemType = itemType;
    }
    
    
    getExpandedRowContent(r:Item):Vnode
    {
        return m(".is-size-7", r.mods.map(mod => m("", mod.description)));
    }
}