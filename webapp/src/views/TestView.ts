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
    selectedItem:IItemModel;
    
    oninit(vnode:Vnode):any
    {
        this.fetch();
    }
    
    fetch():any
    {
        this.loading = true;
        if(this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            m.request({method:"get", url:"/item-models", data:{s:this.filterOptions, page:0, size:15}})
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
    
    focused:boolean = false;
    
    onFocus()
    {
        this.focused = true;
    }
    
    onFocusOut()
    {
        this.focused = false;
    }
    
    onOptionPress(item:IItemModel)
    {
        this.selectedItem = item;
        this.focused = false;
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
    
    getPaging(page:Page<IItemModel>):Vnode
    {
        return m(".columns", [
            m(".column.is-narrow", m(`button.button`, {disabled: page.first, onclick: (e:any) => { page.first && e.preventDefault() }}, "First")),
            m(".column.is-narrow", m(`button.button`, {disabled: page.first, onclick: (e:any) => { page.first && e.preventDefault() }}, "Previous")),
            m(".column.is-vcentered.is-flex", {style: "justify-content: center"}, `${page.number+1}/${page.totalPages}`),
            m(".column.is-narrow", m(`button.button]`, {disabled: page.last, onclick: (e:any) => { page.last && e.preventDefault() }}, "Next")),
            m(".column.is-narrow", m(`button.button`, {disabled: page.last, onclick: (e:any) => { page.last && e.preventDefault() }}, "Last"))
        ]);
    }
    
    view(vnode:Vnode)
    {
        return m(".container", [
            m(".field", [
                m('label.label.is-small', "Search"),
                m('.control.is-expanded', m("input.input[type='text']", {value: this.filterOptions.s, placeholder: 'Filter on name...', oninput: m.withAttr("value", this.onSearchChange.bind(this))})),
            ]),
            m(".field.is-horizontal", m(".field-body", [
                m(".field", [
                    m("label.label.is-small", "Item Type"),
                    m('.control',
                        m(".select",
                            m(`select`, {onchange: m.withAttr("value", this.onItemTypeChange.bind(this))},
                                [m('option'), ...Object.keys(ItemType).map(typeKey => m('option', {value: typeKey, selected: this.itemType === typeKey}, ItemType[<any>typeKey]))]
                            )
                        )
                    )]
                )
            ])),
            ...(this.page ? this.page.content.map(r => m("", r.name)) : [m("")]),
            this.page ? this.getPaging(this.page) : m("")
        ]);
    }
}