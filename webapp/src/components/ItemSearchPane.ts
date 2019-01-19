import {SearchPane} from "./SearchPane";
import * as m from "mithril";
import {Children} from "mithril";
import {ItemFilterOptions} from "../../../service/filters/ItemFilterOptions";
import {FilterOptions} from "../../../service/filters/FilterOptions";
import {IItemType} from "../../../interfaces/IItemType";

export class ItemSearchPane extends SearchPane
{
    filterOptions:ItemFilterOptions = {s:"", itemModel:{s:"", name:""}, modIds:[]};
    itemTypes: IItemType[];
    
    constructor(onFilterOptionsChanged:(filterOptions:FilterOptions) => void)
    {
        super(onFilterOptionsChanged);
        //todo: load itemtypes
        this.itemTypes = [];
    }
    
    setItemTypeField(itemType?:IItemType):void
    {
        if(!itemType) itemType = undefined;
        this.filterOptions.itemModel.itemTypeId = itemType && itemType.id || undefined;
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
                                        this.itemTypes
                                            .map(itemType => m('option', {
                                                value: itemType.name,
                                                selected: this.filterOptions.itemModel.itemTypeId === itemType.id
                                            }, itemType.name))
                                ]
                            )
                        )
                    )]
                )
            )
        ]);
    }
}