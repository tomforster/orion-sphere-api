import * as m from "mithril";
import {ClassComponent, Vnode} from "mithril";
import {IItemModel} from "../../../interfaces/IItemModel";
import {ItemType} from "../../../ItemType";
import {ItemModelFilterOptions} from "../../../service/filters/ItemModelFilterOptions";
import {Page} from "../../../Page";

export class TestView implements ClassComponent
{
    filterOptions:ItemModelFilterOptions = {s:"", itemType:"", name:""};
    timeout:any;
    page:Page<IItemModel>;
    loading:boolean = false;
    selectedItemId:number;
    selectedItem:IItemModel;
    currentPage:number = 0;
    
    oninit(vnode:Vnode):any
    {
        this.fetch();
    }
    
    fetch():any
    {
        this.loading = true;
        if(this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            m.request({method:"get", url:"/item-models", data:{s:this.filterOptions, page:this.currentPage, size:15}})
                .then((r:any) => {
                    this.page = r;
                    m.redraw();
                    this.loading = false;
                }).catch(e => this.loading = false)
        }, 500);
    }
    
    onremove()
    {
        if(this.timeout) clearTimeout(this.timeout);
    }
    
    onOptionPress(item:IItemModel)
    {
        this.selectedItemId = item.id;
        this.selectedItem = item;
    }
    
    itemType:ItemType;
    
    onItemTypeChange(itemType:ItemType)
    {
       this.filterOptions.itemType = itemType;
       this.fetch();
    }
    
    onSearchChange(value:string)
    {
        this.filterOptions.s = value;
        this.fetch();
    }
    
    onNextPress()
    {
        if(!this.page.last)
        {
            this.currentPage++;
            this.fetch();
        }
    }
    
    onFirstPress()
    {
        if(!this.page.first)
        {
            this.currentPage = 0;
            this.fetch();
        }
    }
    
    onLastPress()
    {
        if(!this.page.last)
        {
            this.currentPage = this.page.totalPages-1;
            this.fetch();
        }
    }
    
    onPreviousPress()
    {
        if(!this.page.first)
        {
            this.currentPage--;
            this.fetch();
        }
    }
    
    getPaging(page:Page<IItemModel>):Vnode
    {
        return m(".columns", [
            m(".column.is-narrow", m(`button.button`, {disabled: page.first, onclick: this.onFirstPress.bind(this)}, "First")),
            m(".column.is-narrow", m(`button.button`, {disabled: page.first, onclick: this.onPreviousPress.bind(this)}, "Previous")),
            m(".column.is-vcentered.is-flex", {style: "justify-content: center"}, `${page.number+1}/${page.totalPages}`),
            m(".column.is-narrow", m(`button.button`, {disabled: page.last, onclick: this.onNextPress.bind(this)}, "Next")),
            m(".column.is-narrow", m(`button.button`, {disabled: page.last, onclick: this.onLastPress.bind(this)}, "Last"))
        ]);
    }
    
    view(vnode:Vnode)
    {
        return m(".container.search", [
            m(".columns", {style:"margin-bottom:0px"}, [
                m(".column", m(".field", [
                    m('label.label.is-small', "Search"),
                    m('.control', m("input.input[type='text']", {value: this.filterOptions.s, placeholder: 'Filter on name...', oninput: m.withAttr("value", this.onSearchChange.bind(this))})),
                ])),
                m(".column.is-narrow", m(".field", [
                    m("label.label.is-small", "Item Type"),
                    m('.control.is-expanded',
                        m(".select",
                            m(`select`, {onchange: m.withAttr("value", this.onItemTypeChange.bind(this))},
                                [m('option'), ...Object.keys(ItemType).map(typeKey => m('option', {value: typeKey, selected: this.itemType === typeKey}, ItemType[<any>typeKey]))]
                            )
                        )
                    )]
                ))
            ]),
            m(".box", this.page ? this.page.content.map(r => m(".select-option", {class: this.selectedItemId === r.id ? "selected" : "", onclick: this.onOptionPress.bind(this, r)}, r.name)) : m("")),
            this.page ? this.getPaging(this.page) : m(""),
            m(".box", m(".level", [
                m(".level-left", m(".field", [ m("label.label.is-small", "Selected Item"), m("", this.selectedItem ? this.selectedItem.name : "")])),
                m(".level-right",
                    m(".buttons", [
                        m("button.button.is-danger", "Cancel"),
                        m("button.button.is-primary", "Select")
                    ])
                )
            ]))
        ]);
    }
}