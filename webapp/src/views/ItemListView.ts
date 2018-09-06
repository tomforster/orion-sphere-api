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
        return "items";
    }
    
    getTitle():string
    {
        return "Items";
    }
    
    getControls():Vnode|Vnode[]
    {
        return m(".buttons", [m(`a.button`, {onclick: () => this.selectMode = !this.selectMode}, "Select Items"), m(`a.button.level-item`, {href: `/lammie-html?ids=${this.selectedItems.map(i => i.id).join(",")}`, disabled: !this.selectedItems.length}, "Print Lammies")]);
    }
    
    getFilterControls():Vnode[]
    {   const fields = [];
        fields.push(m(".field", [
            m('label.label.is-small', "Search"),
            m('.control.is-expanded', m("input.input[type='text']", {value: this.filterOptions.s, placeholder: 'Filter on model or serial...', oninput: m.withAttr("value", this.setSearchField.bind(this))})),
        ]));
        fields.push(m(".field.is-horizontal", m(".field-body",
            [
                m(".field", [
                    m("label.label.is-small", "Item Type"),
                    m('.control',
                        m(".select",
                            m(`select`, {onchange: m.withAttr("value", this.setItemTypeField.bind(this))},
                                [m('option'), ...Object.keys(ItemType).map(typeKey => m('option', {value: typeKey, selected: this.filterOptions.itemModel.itemType === typeKey}, ItemType[<any>typeKey]))]
                            )
                        )
                    )]
                ),
                m(".field.is-flex.search-button",
                    m("a.button.is-primary", {onclick: this.onSearchPressed.bind(this)}, "Search")
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
        return m(".columns.is-size-7", [
            m(".column",
                m(".columns", [
                    m(".column.is-narrow.has-text-weight-bold", "Mods"),
                    m(".column", m("ul.with-bullets", r.mods.map(mod => m("li", mod.description))))
                ])
            ),
            m(".column",
                m(".columns", [
                    m(".column.is-narrow.has-text-weight-bold", "Abilities"),
                    m(".column", m("ul.with-bullets", r.mods.map(mod => mod.ability ? m("li", mod.ability.description) : m(""))))
                ])
            ),
            m(".column.is-narrow.is-vcentered.is-flex", m("a.button.is-primary.is-small", "Edit"))
        ]);
    }
}