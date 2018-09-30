import * as m from "mithril";
import {Children, Vnode} from "mithril";
import {FilterOptions} from "../../../service/filters/FilterOptions";
import {View} from "./View";
import {IDomainEntity} from "../../../interfaces/IDomainEntity";
import {Page} from "../../../Page";
import {Paging} from "../components/Paging";
import {SearchPane} from "../components/SearchPane";

export abstract class ListView<T extends IDomainEntity> extends View
{
    page:Page<T> = new Page<T>();
    currentPage:number;
    selectedItems:any[] = [];
    selectMode:boolean = false;
    expandedItem:number | null;
    expandable = false;
    paging:Paging;
    searchPane:SearchPane;
    
    abstract getColumns():string[];
    abstract getRowData(entity:T):Vnode[];
    abstract getCreateUrl():string;
    
    toggleSelectMode()
    {
        this.selectMode = !this.selectMode;
        if(!this.selectMode) this.selectedItems.length = 0;
    }
    
    getControls():Vnode[]
    {
        return [m("a.button.is-success", {href: this.getCreateUrl(), oncreate: m.route.link}, "Create")];
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
    
    getSearchPane():SearchPane
    {
        return new SearchPane(this.fetch.bind(this));
    }
    
    oninit(vnode:Vnode):any
    {
        this.currentPage = 0;
        this.paging = new Paging(this.page, this.onPageChange.bind(this));
        this.searchPane = this.getSearchPane();
        return super.oninit(vnode);
    }
    
    onPageChange(targetPage:number)
    {
        console.log("page change");
        this.currentPage = targetPage;
        this.fetch();
    }
    
    getRow(r:T):Vnode
    {
        return m("tr", {
                onclick: this.onRowClick.bind(this, r),
                class: this.isSelected(r) ? "is-selected is-clickable" : (this.expandable ? "is-clickable" : "")
            },
            (this.selectMode ? [m("td", m("input[type='checkbox']", {checked: this.isSelected(r)}))] : [this.expandable ? m("td", this.expandedItem === r.id ? "-" : "+") : m("td")])
                .concat(this.getRowData(r))
        )
    }
    
    getExpandedRowContent(r:T):Vnode
    {
        throw new Error("Override this if setting expandable true");
    }
    
    async fetch(filterOptions?:FilterOptions)
    {
        let url = this.getUrl();
        
        url += "?" + m.buildQueryString({page: this.currentPage, size: 50, s:filterOptions});
        
        const page = await m.request<Page<T>>({
            method: "get",
            url
        });
        
        Object.assign(this.page, page);
        this.loaded = true;
    }
    
    view(vnode:Vnode):Children | void | null
    {
        if(this.page)
        {
            const bodyContent = this.page.content.map((r:any) => {
                return this.expandable ?
                    [this.getRow(r), m("tr", {class: this.expandedItem === r.id ? "" : "is-hidden"}, [m("td"), m(`td[colspan=${this.getColumns().length + (this.selectMode ? 1 : 0)}]`, this.getExpandedRowContent(r))])] : this.getRow(r)
            });
            
            const table = m("table.table.is-fullwidth.is-narrow",
                m("thead", m("tr", [m("th")].concat(this.getColumns().map(h => m("th", h))))),
                m("tbody", bodyContent));
            
            return m(".container", this.getTitleBar(), m(this.searchPane), table, m(this.paging));
        }
    
        return super.view(vnode);
    }
}