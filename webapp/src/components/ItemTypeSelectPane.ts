import * as m from "mithril";
import {Children, ClassComponent, Vnode} from "mithril";
import {IItemType} from "../../../interfaces/IItemType";

class ItemTypeSelectPane implements ClassComponent
{
    active:boolean = false;
    selectedItemTypes:IItemType[];
    selectedItemType?:IItemType;
    itemTypes:IItemType[];
    isSingleSelect:boolean = false;
    onSelectedItemChange:(itemType:IItemType) => void;
    
    constructor(selected?:IItemType[] | IItemType, onSelectedItemChange?:(itemType:IItemType) => void)
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
        this.itemTypes = [];
    }
    
    onOptionPress(itemType:IItemType)
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
    
    isSelected(itemType:IItemType)
    {
        if(this.isSingleSelect) return this.selectedItemType === itemType;
        return !!this.selectedItemTypes.find(selectedItemType => selectedItemType === itemType);
    }
    
    view(vnode:Vnode):Children
    {
        if(this.isSingleSelect)
        {
            return [
                m(".control", {onclick: this.open.bind(this)}, m(".input", this.selectedItemType && this.selectedItemType.name)),
                m(".modal.search", {class: this.active ? "is-active" : ""}, [
                    m(".modal-background", {onclick: this.onClosePress.bind(this)}),
                    m(".modal-content", m(".box", [
                        m(".results", this.itemTypes.map(r => m(".select-option", {
                            class: this.isSelected(r) ? "selected" : "",
                            onclick: this.onOptionPress.bind(this, r)
                        }, r.name)))
                    ])),
                    m("button.modal-close.is-large", {onclick: this.onClosePress.bind(this)})
                ])
            ]
        }
        return [
            m(".control", {onclick: this.open.bind(this)}, m(".input", this.selectedItemTypes.map(r => r.name).join(", "))),
            m(".modal.search", {class: this.active ? "is-active" : ""}, [
                m(".modal-background", {onclick: this.onClosePress.bind(this)}),
                m(".modal-content", m(".box", [
                    m(".results", this.itemTypes.map(r => m(".select-option", {
                            class: this.isSelected(r) ? "selected" : "",
                            onclick: this.onOptionPress.bind(this, r)
                        }, m(".columns", [
                            m(".column", r.name),
                            m(".column.is-narrow", m(".icon", this.isSelected(r) ? m("span.fas.fa-check-square") : m("span.fas.fa-square")))
                        ])
                    )))
                ])),
                m("button.modal-close.is-large", {onclick: this.onClosePress.bind(this)})
            ])];
    }
}