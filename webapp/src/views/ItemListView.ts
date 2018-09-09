import {ListView} from "./ListView";
import * as m from "mithril";
import {Vnode} from "mithril";
import {ItemType} from "../../../ItemType";
import {ItemFilterOptions} from "../../../service/filters/ItemFilterOptions";
import {IItem} from "../../../interfaces/IItem";

export class ItemListView extends ListView<IItem, ItemFilterOptions>
{
    filterOptions:ItemFilterOptions = {s:"", itemModel:{s:"", name:"", itemType:""}, modIds:[]};
    expandable = true;
    
    getColumns():string[]
    {
        return ["Serial", "Model", "Mods", "Type", "Maint. Cost", "+Mod Cost"];
    }
    
    getRowData(item:IItem)
    {
        return [m("td", item.serial), m("td", item.itemModel.name || ""), m("td", item.mods.length), m("td", item.itemModel && ItemType[<any>item.itemModel.itemType] || ""), m("td", item.maintenanceCost), m("td", item.modCost)];
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
        return m(".buttons", [m(`a.button`, {onclick: () => this.selectMode = !this.selectMode}, "Select Items"), m(`a.button`, {href: `/lammie-html?ids=${this.selectedItems.map(i => i.id).join(",")}`, disabled: !this.selectedItems.length}, "Print Lammies")]);
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
    
    
    getExpandedRowContent(r:IItem):Vnode
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
            m(".column.is-narrow.is-vcentered.is-flex", m(`a.button.is-primary.is-small[href=/item/${r.id}]`, {oncreate: m.route.link}, "View/Edit"))
        ]);
    }
}