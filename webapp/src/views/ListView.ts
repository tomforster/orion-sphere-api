import * as m from "mithril";
import {Children, ClassComponent, Vnode} from "mithril";
import {Page} from "../index";
import {DomainEntity} from "../../../entity/DomainEntity"
import {FilterOptions} from "../../../service/filters/FilterOptions";

export abstract class ListView<T extends DomainEntity, F extends FilterOptions> implements ClassComponent
{
    page:Page<T> | undefined;
    loaded:boolean = false;
    currentPage:number;
    selectedItems:any[] = [];
    selectMode:boolean = false;
    expandedItem:number | null;
    
    async fetch()
    {
        let url = this.getUrl();
        
        url += "?" + m.buildQueryString({page: this.currentPage, size: 50, s:this.filterOptions});
        
        this.page = await m.request<Page<T>>({
            method: "get",
            url
        });
        this.loaded = true;
    }
    
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
    
    abstract getColumns():string[];
    
    abstract getRowTemplate():(item:T) => (number | string)[];
    
    getUrl():string
    {
        return "/" + this.getUrlPath();
    }
    
    abstract getUrlPath():string;
    
    abstract getTitle():string;
    
    getControls():Vnode
    {
        return m("");
    }
    
    oninit(vnode:Vnode):any
    {
        this.currentPage = (vnode.attrs as any).key - 1;
        this.fetch();
    }
    
    onupdate(vnode:Vnode):any
    {
    
    }
    
    getPaging(page:Page<T>):Vnode
    {
        return m(".level",
            m(".level-left", m(`a.button.level-item[href=/${this.getUrlPath()}/${page.number}]`, {oncreate: m.route.link, disabled: page.first, onclick: (e:any) => { page.first && e.preventDefault() }}, "Previous")),
            m(".level-right", m(`a.button.level-item[href=/${this.getUrlPath()}/${page.number+2}]`, {oncreate: m.route.link, disabled: page.last, onclick: (e:any) => { page.last && e.preventDefault() }}, "Next")));
    }
    
    onSearchPressed()
    {
        this.fetch();
    }
    
    abstract filterOptions:F;
    
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
    
    expandable = false;
    
    getRow(r:T):Vnode
    {
        return m("tr", {
                onclick: this.onRowClick.bind(this, r),
                class: this.isSelected(r) ? "is-selected" : ""
            },
            (this.selectMode ? [m("td", m("input[type='checkbox']", {checked: this.isSelected(r)}))] : [])
                .concat(this.getRowTemplate()(r).map((t:any) => m("td", t)))
        )
    }
    
    getExpandedRowContent(r:T):Vnode
    {
        throw new Error("Override this if setting expandable true");
    }
    
    view(vnode:Vnode):Children | void | null
    {
        if(this.page)
        {
            const titleBar = m(".level",
                m(".level-left", m("h1.subtitle", this.getTitle())),
                m(".level-right", this.getControls()));
            
            const filters = m(".box", this.getFilterControls());
            
            const bodyContent = this.page.content.map((r:any) => {
                return this.expandable ?
                    [this.getRow(r), m("tr", {class: this.expandedItem === r.id ? "" : "is-hidden"}, m(`td[colspan=${this.getColumns().length + (this.selectMode ? 1 : 0)}]`, this.getExpandedRowContent(r)))] : this.getRow(r)
            });
            
            const table = m("table.table.is-fullwidth.is-narrow",
                m("thead", m("tr", [this.selectMode ? m("th") : []].concat(this.getColumns().map(h => m("th", h))))),
                m("tbody", bodyContent));
            
            return m(".container", titleBar, filters, table, this.getPaging(this.page));
        }
        
        return m(".container");
    }
}