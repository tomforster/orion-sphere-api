import * as m from "mithril";
import {Children, ClassComponent, Vnode} from "mithril";
import {ItemType} from "../../../ItemType";

export class ItemTypeSelectPane implements ClassComponent
{
    active:boolean = false;
    selectedItemTypes:ItemType[];
    selectedItemType?:ItemType;
    itemTypes:ItemType[];
    isSingleSelect:boolean = false;
    onSelectedItemChange:(itemType:ItemType) => void;
    
    constructor(selected?:ItemType[] | ItemType, onSelectedItemChange?:(itemType:ItemType) => void)
    {
        if(Array.isArray(selected))
        {
            this.selectedItemTypes = selected;
        }
        else
        {
            this.isSingleSelect = true;
            if(!onSelectedItemChange) throw new Error("Must select item change function on single select.");
            this.onSelectedItemChange = onSelectedItemChange;
            this.selectedItemType = selected;
        }
        this.itemTypes = <ItemType[]>Object.keys(ItemType);
    }
    
    onOptionPress(itemType:ItemType)
    {
        if(this.isSingleSelect)
        {
            this.selectedItemType = itemType;
            this.onSelectedItemChange(itemType);
            this.onClosePress();
            return;
        }
        if(this.isSelected(itemType))
        {
            const index = this.selectedItemTypes.indexOf(itemType);
            if(index > -1)
                this.selectedItemTypes.splice(index, 1);
        }
        else
        {
            this.selectedItemTypes.push(itemType);
        }
    }
    
    onClosePress()
    {
        this.active = false;
    }
    
    open()
    {
        this.active = true;
    }
    
    isSelected(itemType:ItemType)
    {
        if(this.isSingleSelect) return this.selectedItemType === itemType;
        return !!this.selectedItemTypes.find(selectedItemType => selectedItemType === itemType);
    }
    
    view(vnode:Vnode):Children
    {
        if(this.isSingleSelect)
        {
            return [
                m(".control", {onclick: this.open.bind(this)}, m(".input", this.selectedItemType && ItemType[<any> this.selectedItemType])),
                m(".modal.search", {class: this.active ? "is-active" : ""}, [
                    m(".modal-background", {onclick: this.onClosePress.bind(this)}),
                    m(".modal-content", m(".box", [
                        m(".results", this.itemTypes.map(r => m(".select-option", {
                            class: this.isSelected(r) ? "selected" : "",
                            onclick: this.onOptionPress.bind(this, r)
                        }, ItemType[<any>r])))
                    ])),
                    m("button.modal-close.is-large", {onclick: this.onClosePress.bind(this)})
                ])
            ]
        }
        return [
            m(".control", {onclick: this.open.bind(this)}, m(".input", this.selectedItemTypes.map(r => ItemType[<any> r]).join(", "))),
            m(".modal.search", {class: this.active ? "is-active" : ""}, [
                m(".modal-background", {onclick: this.onClosePress.bind(this)}),
                m(".modal-content", m(".box", [
                    m(".results", this.itemTypes.map(r => m(".select-option", {
                            class: this.isSelected(r) ? "selected" : "",
                            onclick: this.onOptionPress.bind(this, r)
                        }, m(".columns", [
                            m(".column", ItemType[<any>r]),
                            m(".column.is-narrow", m(".icon", this.isSelected(r) ? m("span.fas.fa-check-square") : m("span.fas.fa-square")))
                        ])
                    )))
                ])),
                m("button.modal-close.is-large", {onclick: this.onClosePress.bind(this)})
            ])];
    }
}