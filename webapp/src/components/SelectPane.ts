import * as m from "mithril";
import {Children, ClassComponent, Vnode} from "mithril";
import {Page} from "../../../service/filters/Page";
import {Paging} from "./Paging";
import {SearchPane} from "./SearchPane";
import {IDomainEntity} from "../../../interfaces/IDomainEntity";
import {Pageable} from "../../../service/filters/Pageable";
import {FilterOptions} from "../../../service/filters/FilterOptions";

export class SelectPane<T extends IDomainEntity> implements ClassComponent
{
    timeout:any;
    page:Page<T> = new Page<T>();
    loading:boolean = false;
    selectedItemId:number;
    selectedItem:T | undefined;
    pageable:Pageable;
    filterOptions:FilterOptions;
    paging:Paging;
    searchPane:SearchPane;
    url:string;
    active:boolean = false;
    buttonText:string | undefined;
    onItemSelected:(item:T) => void;
    
    constructor(url:string, filterOptions:FilterOptions = {s:""}, onItemSelected:(item:T) => void, selectedItem?:T, buttonText?: string)
    {
        this.selectedItem = selectedItem;
        this.url = url;
        this.buttonText = buttonText;
        this.onItemSelected = onItemSelected;
        this.filterOptions = filterOptions;
        if(!filterOptions.s) filterOptions.s = "";
    }
    
    oninit(vnode:Vnode):any
    {
        this.paging = new Paging(this.page, this.onPageChange.bind(this));
        this.searchPane = this.getSearchPane();
        this.fetch();
    }
    
    getSearchPane():SearchPane
    {
        return new SearchPane(this.fetch.bind(this));
    }
    
    async fetch()
    {
        console.log(this.filterOptions);
        this.loading = true;
        try
        {
            const page = await m.request({
                method: "get",
                url: this.url,
                data: {p: this.pageable, s: this.filterOptions}
            });
            Object.assign(this.page, page);
            this.pageable = {page:this.page.number, size: this.page.size, sort:this.page.sort};
            this.loading = false;
        }
        catch(e)
        {
            this.loading = false;
        }
    }
    
    onremove()
    {
        if(this.timeout) clearTimeout(this.timeout);
    }
    
    onOptionPress(item:T)
    {
        this.selectedItemId = item.id;
        this.selectedItem = item;
        this.onClosePress();
        this.onItemSelected(item);
    }
    
    onPageChange(targetPage:number)
    {
        this.pageable.page = targetPage;
        this.fetch();
    }
    
    getItemText(item:T):string
    {
        if(item.hasOwnProperty("name"))
        {
            return (item as any).name;
        }
        else if(item.hasOwnProperty("description"))
        {
            return (item as any).description;
        }
        return item.id.toString();
    }
    
    onClosePress()
    {
        this.active = false;
    }
    
    open()
    {
        this.active = true;
        if(this.buttonText)
        {
            this.selectedItem = undefined;
            this.selectedItemId = 0;
        }
    }
    
    view(vnode:Vnode):Children
    {
        return [
            this.buttonText ? m("a.button.is-primary.is-small", {onclick: this.open.bind(this)}, this.buttonText) : m(".input", {onclick: this.open.bind(this)}, this.selectedItem ? this.getItemText(this.selectedItem) : ""),
            m(".modal.search", {class: this.active ? "is-active" : ""}, [
            m(".modal-background", {onclick: this.onClosePress.bind(this)}),
            m(".modal-content", m(".box", [
                m(this.searchPane),
                m(".box", {style:"position: relative"}, [
                    m(".lmask", {class: this.loading ? "" : "is-hidden"}),
                    m(".results", this.page ?
                        this.page.content.map(r => m(".select-option", {
                            class: this.selectedItemId === r.id ? "selected" : "",
                            onclick: this.onOptionPress.bind(this, r)
                        }, this.getItemText(r))) :
                        m(""))
                ]),
                m(this.paging)
            ])),
            m("button.modal-close.is-large", {onclick: this.onClosePress.bind(this)})
        ])];
    }
}