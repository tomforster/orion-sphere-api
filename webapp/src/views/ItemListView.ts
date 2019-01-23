import {ListView} from "./ListView";
import m, {Vnode} from "mithril";
import {IItem} from "../../../interfaces/IItem";
import {ItemSearchPane} from "../components/ItemSearchPane";
import {ColumnHeader} from "../components/ColumnHeader";

export class ItemListView extends ListView<IItem>
{
    expandable = true;
    
    getSearchPane()
    {
        return new ItemSearchPane(this.onSearchChange.bind(this));
    }
    
    getColumns():ColumnHeader[]
    {
        return [new ColumnHeader("Serial", "serial"),
            new ColumnHeader("Model", "model.name"),
            new ColumnHeader("Mods"),
            new ColumnHeader("Type"),
            new ColumnHeader("Maint. Cost", "maintenanceCost"),
            new ColumnHeader("+Mod Cost", "modCost")];
    }
    
    getRowData(item:IItem)
    {
        return [
            m("td", item.serial),
            m("td", item.itemModel && item.itemModel.name || ""),
            m("td", item.itemMods.reduce((acc, mod) => acc + mod.count,0)),
            m("td", item.itemModel && item.itemModel.itemType && item.itemModel.itemType.name || ""),
            m("td", item.maintenanceCost),
            m("td", item.modCost)
        ];
    }
    
    getCreateUrl():string
    {
        return "/item/create"
    }
    
    getUrlPath():string
    {
        return "items";
    }
    
    getTitle():string
    {
        return "Items";
    }
    
    getControls():Vnode[]
    {
        return [
            m("a.button", {
                onclick: this.toggleSelectMode.bind(this)
            }, "Select Items"),
            m("a.button.is-info", {
                onclick: () => this.selectedItems.length && window.open(`/lammie-html?ids=${this.selectedItems.map(i => i.id).join(",")}`, "_tab"),
                disabled: !this.selectedItems.length
            }, "Print Lammies"),
            m("a.button.is-success", {href: this.getCreateUrl(), oncreate: m.route.link}, "Create")
        ];
    }
    
    getExpandedRowContent(r:IItem):Vnode
    {
        return m(".columns.is-size-7", [
            m(".column",
                m(".columns", [
                    m(".column.is-narrow.has-text-weight-bold", "Mods"),
                    m(".column", m("ul.with-bullets", r.itemMods.map(itemMod => m("li", itemMod.mod.description))))
                ])
            ),
            m(".column",
                m(".columns", [
                    m(".column.is-narrow.has-text-weight-bold", "Abilities"),
                    m(".column", m("ul.with-bullets", r.itemMods.map(itemMod => itemMod.mod.ability ? m("li", itemMod.mod.ability.description) : m(""))))
                ])
            ),
            m(".column.is-narrow.is-vcentered.is-flex", m(`a.button.is-primary.is-small[href=/item/${r.id}]`, {oncreate: m.route.link}, "View/Edit"))
        ]);
    }
}