import {ListView} from "./ListView";
import {IItemModel} from "../../../interfaces/IItemModel";
import m, {Vnode} from "mithril";
import {ItemModelSearchPane} from "../components/ItemModelSearchPane";
import {ColumnHeader} from "../components/ColumnHeader";

export class ItemModelListView extends ListView<IItemModel>
{
    expandable = true;
    
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
            new ColumnHeader("Base Charges", "baseCharges"),
            new ColumnHeader("# Abilities")
        ];
    }
    
    getRowData(itemModel:IItemModel)
    {
        return [m("td", m(`a[href=/item-model/${itemModel.id}]`, {oncreate: m.route.link}, itemModel.name)),
            m("td", itemModel.itemType && itemModel.itemType.name || ""),
            m("td", itemModel.baseCost),
            m("td", itemModel.baseCharges),
            m("td", itemModel.abilities.length)
        ];
    }
    
    getUrlPath():string
    {
        return "item-models";
    }
    
    getTitle():string
    {
        return "Models";
    }
    
    getExpandedRowContent(r:IItemModel):Vnode
    {
        return m(".columns.is-size-7", [
            m(".column",
                m(".columns", [
                    m(".column.is-narrow.has-text-weight-bold", "Abilities"),
                    m(".column", m("ul.with-bullets", r.abilities.map(ability => m("li", ability.description))))
                ])
            ),
            m(".column.is-narrow.is-vcentered.is-flex", m(`a.button.is-primary.is-small[href=/item-model/${r.id}]`, {oncreate: m.route.link}, "View/Edit"))
        ]);
    }
}