import {ListView} from "./ListView";
import {ItemType} from "../../../ItemType";
import {ItemModelFilterOptions} from "../../../service/filters/ItemModelFilterOptions";
import {IItemModel} from "../../../interfaces/IItemModel";
import * as m from "mithril";
import {Vnode} from "mithril";

export class ItemModelListView extends ListView<IItemModel, ItemModelFilterOptions>
{
    filterOptions = {s:"", itemType:"", name:""};
    
    getColumns():string[]
    {
        return ["Name", "Item Type", "Base Cost", "Base Charges"];
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
    
    getFilterControls():Vnode[]
    {   const fields = [];
        fields.push(m(".field", [
            m('label.label.is-small', "Search"),
            m('.control.is-expanded', m("input.input[type='text']", {value: this.filterOptions.s, placeholder: 'Filter on name...', oninput: m.withAttr("value", this.setSearchField.bind(this))})),
        ]));
        fields.push(m(".field.is-horizontal", m(".field-body",
            [
                m(".field", [
                    m("label.label.is-small", "Item Type"),
                    m('.control',
                        m(".select",
                            m(`select`, {onchange: m.withAttr("value", this.setItemTypeField.bind(this))},
                                [m('option'), ...Object.keys(ItemType).map(typeKey => m('option', {value: typeKey, selected: this.filterOptions.itemType === typeKey}, ItemType[<any>typeKey]))]
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
        this.filterOptions.itemType = itemType;
    }
}