import {SearchPane} from "./SearchPane";
import {ItemModelFilterOptions} from "../../../service/filters/ItemModelFilterOptions";
import {FilterOptions} from "../../../service/filters/FilterOptions";
import * as m from "mithril";
import {Vnode} from "mithril";
import {ItemType} from "../../../ItemType";

export class ItemModelSearchPane extends SearchPane
{
    filterOptions:ItemModelFilterOptions;
    
    constructor(filterOptions:ItemModelFilterOptions, onSearchPressed:(filterOptions:FilterOptions) => void)
    {
        super(filterOptions, onSearchPressed);
    }
    
    setItemTypeField(itemType:string):void
    {
        if(!itemType) itemType = "";
        this.filterOptions.itemType = itemType;
    }
    
    view():Vnode[]
    {
        return [
            m(".field", [
                m('label.label.is-small', "Search"),
                m('.control.is-expanded', m("input.input[type='text']", {value: this.filterOptions.s, placeholder: 'Filter on name...', oninput: m.withAttr("value", this.setSearchField.bind(this))})),
            ]),
            m(".field.is-horizontal", m(".field-body",
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
            ))
        ];
    }
}