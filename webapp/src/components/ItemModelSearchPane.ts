import {SearchPane} from "./SearchPane";
import {ItemModelFilterOptions} from "../../../service/filters/ItemModelFilterOptions";
import m, {Children} from "mithril";
import {IItemType} from "../../../interfaces/IItemType";
import {Page} from "../../../service/filters/Page";
import {FilterOptions} from "../../../service/filters/FilterOptions";

export class ItemModelSearchPane extends SearchPane
{
    filterOptions:ItemModelFilterOptions = {s:"", name:""};
    itemTypes:IItemType[];
    
    constructor(onFilterOptionsChanged:(filterOptions:FilterOptions) => void)
    {
        super(onFilterOptionsChanged);
        m.request<Page<IItemType>>("/item-types").then(res => {
            this.itemTypes = res.content;
            m.redraw();
        });
        this.itemTypes = [];
    }
    
    setItemTypeField(event:Event):void
    {
        if (event.target && event.target instanceof HTMLSelectElement)
        {
            const itemTypeOption:HTMLOptionElement = Array.from(event.target.selectedOptions)[0];
            console.log(itemTypeOption);
            const itemType = this.itemTypes.find(itemType => itemType.name == itemTypeOption.textContent);
            console.log(itemType);
            this.filterOptions.itemTypeId = itemType && itemType.id || undefined;
            this.updateSearchOptions();
        }
    }
    
    view():Children
    {
        return m(".columns", [
            m(".column.is-three-quarters",
                m(".field", [
                    m('label.label.is-small', "Search"),
                    m('.control.is-expanded', m("input.input[type='text']", {
                        placeholder: 'Filter on name...',
                        oninput: this.updateSearchField.bind(this)})),
                ])
            ),
            m(".column",
                m(".field", [
                    m("label.label.is-small", "Item Type"),
                    m('.control',
                        m(".select",
                            m(`select`, {onchange: this.setItemTypeField.bind(this)},
                                [
                                    m('option'),
                                    this.itemTypes
                                        .map(itemType => m('option', {
                                            value: itemType.name,
                                            selected: this.filterOptions.itemTypeId === itemType.id
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