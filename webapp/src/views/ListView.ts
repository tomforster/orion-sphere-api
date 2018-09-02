import * as m from "mithril";
import {Children, ClassComponent, Vnode} from "mithril";
import {Page} from "../index";
import {DomainEntity} from "../../../entity/DomainEntity"
import {ItemType} from "../../../ItemType";

export abstract class ListView<T extends DomainEntity> implements ClassComponent
{
    page:Page<T> | undefined;
    loaded:boolean = false;
    currentPage:number;
    selectedItems:any[] = [];
    itemTypePromise:Promise<ItemType[]>;
    itemTypes:ItemType[] | undefined;
    selectMode:boolean = false;
    
    constructor(itemTypePromise:Promise<ItemType[]>)
    {
        this.itemTypePromise = itemTypePromise;
    }
    
    async fetch(search?:string)
    {
        let url = this.getUrl();
        
        if(search)
        {
            url += "?" + m.buildQueryString({page: this.currentPage, size: 50, s:search});
        }
        else
        {
            url += "?" + m.buildQueryString({page: this.currentPage, size: 50});
        }
        
        this.itemTypes = await this.itemTypePromise;
        this.page = await m.request<Page<T>>({
            method: "get",
            url
        });
        this.loaded = true;
    }
    
    selectRow(item:any)
    {
        if(!this.selectMode) return;
        const index = this.selectedItems.findIndex(selectedItem => item.id == selectedItem.id);
        
        if(index > -1)
        {
            this.selectedItems.splice(index, 1);
        }
        else
        {
            this.selectedItems.push(item);
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
            m(".level-left", m(`a.button.level-item[href=/${this.getUrlPath()}/${page.number}]`, {oncreate: m.route.link, disabled: page.first}, "Previous")),
            m(".level-right", m(`a.button.level-item[href=/${this.getUrlPath()}/${page.number+2}]`, {oncreate: m.route.link, disabled: page.last}, "Next")));
    }
    
    onSearchPressed()
    {
        if(this.searchField) this.fetch(this.searchField);
    }
    
    searchField:string;
    
    setSearchField(searchField:string):void
    {
        this.searchField = searchField;
    }
    
    view(vnode:Vnode):Children | void | null
    {
        if(this.page)
        {
            const titleBar = m(".level",
                m(".level-left", m("h1.subtitle", this.getTitle())),
                m(".level-right", this.getControls()));
            
            const filters = m(".box", m(".field.has-addons", [
                m('.control.is-expanded', m("input.input[type='text']", {placeholder: 'Type to filter...', oninput: m.withAttr("value", this.setSearchField.bind(this))})),
                m('.control', m("a.button.is-info", {onclick: this.onSearchPressed.bind(this)}, "Search"))
            ]));
            
            const table = m("table.table.is-fullwidth.is-narrow",
                m("thead", m("tr", [this.selectMode ? m("th") : []].concat(this.getColumns().map(h => m("th", h))))),
                m("tbody", this.page.content.map((r:any) => m("tr", {
                    onclick: this.selectRow.bind(this, r),
                    class: this.isSelected(r) ? "is-selected" : ""
                }, (this.selectMode ? [m("td", m("input[type='checkbox']", {checked: this.isSelected(r)}))] : []).concat(this.getRowTemplate()(r).map((t:any) => m("td", t)))))));
            
            return m(".container", titleBar, filters, table, this.getPaging(this.page));
        }
        
        return m(".container");
    }
}