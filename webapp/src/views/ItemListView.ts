import {ListView} from "./ListView";
import * as m from "mithril";
import {Vnode} from "mithril";
import {ItemType} from "../../../ItemType";
import {ItemFilterOptions} from "../../../service/filters/ItemFilterOptions";
import {IItem} from "../../../interfaces/IItem";
import {ItemSearchPane} from "../components/ItemSearchPane";

export class ItemListView extends ListView<IItem, ItemFilterOptions>
{
    expandable = true;
    
    getSearchPane()
    {
        return new ItemSearchPane(this.fetch.bind(this));
    }
    
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