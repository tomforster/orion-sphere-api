import {SearchPane} from "./SearchPane";
import {ItemModelFilterOptions} from "../../../service/filters/ItemModelFilterOptions";
import * as m from "mithril";
import {Children} from "mithril";
import {ItemType} from "../../../ItemType";

export class ItemModelSearchPane extends SearchPane
{
    filterOptions:ItemModelFilterOptions = {s:"", name:"", itemType:""};
    
    setItemTypeField(itemType:string):void
    {
        if(!itemType) itemType = "";
        this.filterOptions.itemType = itemType;
        this.updateSearchOptions();
    }
    
    view():Children
    {
        return m(".columns", [
            m(".column.is-three-quarters",
                m(".field", [
                    m('label.label.is-small', "Search"),
                    m('.control.is-expanded', m("input.input[type='text']", {
                        placeholder: 'Filter on name...',
                        oninput: m.withAttr("value", this.updateSearchField.bind(this))})),
                ])
            ),
            m(".column",
                m(".field", [
                    m("label.label.is-small", "Item Type"),
                    m('.control',
                        m(".select",
                            m(`select`, {onchange: m.withAttr("value", this.setItemTypeField.bind(this))},
                                [
                                    m('option'),
                                    ...Object.keys(ItemType)
                                        .map(typeKey => m('option', {
                                            value: typeKey,
                                            selected: this.filterOptions.itemType === typeKey
                                        }, ItemType[<any>typeKey]))
                                ]
                            )
                        )
                    )]
                )
            )
        ]);
    }
}