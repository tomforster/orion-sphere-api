import m, {Children, Vnode} from "mithril";
import {FilterOptions} from "../../../service/filters/FilterOptions";
import {View} from "./View";
import {IDomainEntity} from "../../../interfaces/IDomainEntity";
import {Page} from "../../../service/filters/Page";
import {Paging} from "../components/Paging";
import {SearchPane} from "../components/SearchPane";
import {Pageable} from "../../../service/filters/Pageable";
import {ColumnHeader} from "../components/ColumnHeader";

export abstract class ListView<T extends IDomainEntity> extends View
{
    page:Page<T> = new Page<T>();
    pageable:Pageable;
    selectedItems:any[] = [];
    selectMode:boolean = false;
    expandedItem:number | null;
    expandable = false;
    paging:Paging;
    searchPane:SearchPane;
    filterOptions:FilterOptions | undefined;
    
    abstract getColumns():ColumnHeader[];
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
        return new SearchPane(this.onSearchChange.bind(this));
    }
    
    oninit(vnode:Vnode):any
    {
        this.pageable = {page: 0, size: 50, sort: {field:"id", direction: "DESC"}};
        this.filterOptions = {};
        this.paging = new Paging(this.page, this.onPageChange.bind(this));
        this.searchPane = this.getSearchPane();
        return super.oninit(vnode);
    }
    
    onPageChange(targetPage:number)
    {
        this.pageable.page = targetPage;
        this.fetch();
    }
    
    onSearchChange(filterOptions?:FilterOptions)
    {
        this.filterOptions = filterOptions;
        this.fetch();
    }
    
    onColumnClick(columnHeader:ColumnHeader)
    {
        if(columnHeader.sortField)
        {
            //swap dir if its already selected
            console.log(this.pageable.sort, columnHeader);
            if (this.pageable.sort && this.pageable.sort.field === columnHeader.sortField)
            {
                this.pageable.sort.direction = this.pageable.sort.direction === "ASC" ? "DESC" : "ASC";
            }
            else
            {
                this.pageable.sort = {field: columnHeader.sortField, direction: "ASC"};
            }
            this.fetch();
        }
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
    
    onSelectAllClick(e:Event)
    {
        if(this.selectMode && this.page)
        {
            this.page.content.forEach(item =>{
                const index = this.selectedItems.findIndex(selectedItem => item.id == selectedItem.id);
    
                if (index < 0)
                {
                    this.selectedItems.push(item);
                }
            });
            e.stopPropagation();
        }
    }
    
    async fetch()
    {
        let url = this.getUrl();
        url += "?" + m.buildQueryString({p:this.pageable, s:this.filterOptions});
        
        const page = await m.request<Page<T>>({
            method: "get",
            url
        });
        
        Object.assign(this.page, page);
        this.pageable = {page:this.page.number, size: this.page.size, sort:this.page.sort};
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
                m("thead", m("tr", [m("th", {onclick: this.onSelectAllClick.bind(this)})].concat(this.getColumns()
                    .map(columnHeader => m("th", columnHeader.sortField ? {onclick: this.onColumnClick.bind(this, columnHeader)} : {}, [columnHeader.label, columnHeader.sortField === this.pageable.sort.field ? m("span.icon", this.pageable.sort.direction === "ASC" ? m("i.fas.fa-chevron-down") : m("i.fas.fa-chevron-up")) : m("")]))
                ))),
                m("tbody", bodyContent));
            
            return m(".container", this.getTitleBar(), m(this.searchPane), table, m(this.paging));
        }
    
        return super.view(vnode);
    }
}