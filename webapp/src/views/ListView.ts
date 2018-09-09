import * as m from "mithril";
import {Children, Vnode} from "mithril";
import {Page} from "../index";
import {DomainEntity} from "../../../entity/DomainEntity"
import {FilterOptions} from "../../../service/filters/FilterOptions";
import {View} from "./View";

export abstract class ListView<T extends DomainEntity, F extends FilterOptions> extends View
{
    page:Page<T> | undefined;
    currentPage:number;
    selectedItems:any[] = [];
    selectMode:boolean = false;
    expandedItem:number | null;
    expandable = false;
    
    abstract filterOptions:F;
    abstract getColumns():string[];
    abstract getRowTemplate():(item:T) => (number | string)[];
    
    onRowClick(item:any)
    {
        if(!this.selectMode)
        {
            this.expandedItem = this.expandedItem === item.id ? null : item.id
        }
        else
        {
            const index = this.selectedItems.findIndex(selectedItem => item.id == selectedItem.id);
    
            if (index > -1)
            {
                this.selectedItems.splice(index, 1);
            }
            else
            {
                this.selectedItems.push(item);
            }
        }
    }
    
    isSelected(item:any)
    {
        if(!this.selectMode) return false;
        const index = this.selectedItems.findIndex(selectedItem => item.id == selectedItem.id);
        return index > -1;
    }
    
    oninit(vnode:Vnode):any
    {
        this.currentPage = (vnode.attrs as any).key - 1;
        return super.oninit(vnode);
    }
    
    getPaging(page:Page<T>):Vnode
    {
        return m(".columns", [
            m(".column.is-narrow", m(`a.button[href=/${this.getUrlPath()}/1]`, {oncreate: m.route.link, disabled: page.first, onclick: (e:any) => { page.first && e.preventDefault() }}, "First")),
            m(".column.is-narrow", m(`a.button[href=/${this.getUrlPath()}/${page.number}]`, {oncreate: m.route.link, disabled: page.first, onclick: (e:any) => { page.first && e.preventDefault() }}, "Previous")),
            m(".column.is-vcentered.is-flex", {style: "justify-content: center"}, `${page.number+1}/${page.totalPages}`),
            m(".column.is-narrow", m(`a.button[href=/${this.getUrlPath()}/${page.number+2}]`, {oncreate: m.route.link, disabled: page.last, onclick: (e:any) => { page.last && e.preventDefault() }}, "Next")),
            m(".column.is-narrow", m(`a.button[href=/${this.getUrlPath()}/${page.totalPages}]`, {oncreate: m.route.link, disabled: page.last, onclick: (e:any) => { page.last && e.preventDefault() }}, "Last"))
        ]);
    }
    
    onSearchPressed()
    {
        this.fetch();
    }
    
    setSearchField(searchField:string):void
    {
        this.filterOptions.s = searchField;
    }
    
    getFilterControls():Vnode[]
    {
        return [m(".field.has-addons", [
            m('.control.is-expanded', m("input.input[type='text']", {value: this.filterOptions.s, placeholder: 'Type to filter...', oninput: m.withAttr("value", this.setSearchField.bind(this))})),
            m('.control', m("a.button.is-primary", {onclick: this.onSearchPressed.bind(this)}, "Search"))
        ])];
    }
    
    getRow(r:T):Vnode
    {
        return m("tr", {
                onclick: this.onRowClick.bind(this, r),
                class: this.isSelected(r) ? "is-selected is-clickable" : "is-clickable"
            },
            (this.selectMode ? [m("td", m("input[type='checkbox']", {checked: this.isSelected(r)}))] : [this.expandable ? m("td", this.expandedItem === r.id ? "-" : "+") : m("td")])
                .concat(this.getRowTemplate()(r).map((t:any) => m("td", t)))
        )
    }
    
    getExpandedRowContent(r:T):Vnode
    {
        throw new Error("Override this if setting expandable true");
    }
    
    async fetch()
    {
        let url = this.getUrl();
        
        url += "?" + m.buildQueryString({page: this.currentPage, size: 100, s:this.filterOptions});
        
        this.page = await m.request<Page<T>>({
            method: "get",
            url
        });
        this.loaded = true;
    }
    
    view(vnode:Vnode):Children | void | null
    {
        if(this.page)
        {
            const filters = m(".box", this.getFilterControls());
            
            const bodyContent = this.page.content.map((r:any) => {
                return this.expandable ?
                    [this.getRow(r), m("tr", {class: this.expandedItem === r.id ? "" : "is-hidden"}, [m("td"), m(`td[colspan=${this.getColumns().length + (this.selectMode ? 1 : 0)}]`, this.getExpandedRowContent(r))])] : this.getRow(r)
            });
            
            const table = m("table.table.is-fullwidth.is-narrow",
                m("thead", m("tr", [m("th")].concat(this.getColumns().map(h => m("th", h))))),
                m("tbody", bodyContent));
            
            return m(".container", this.getTitleBar(), filters, table, this.getPaging(this.page));
        }
    
        return super.view(vnode);
    }
}