import * as m from "mithril";
import {Children, ClassComponent, Vnode} from "mithril";
import {Page} from "../../../Page";
import {Paging} from "./Paging";
import {SearchPane} from "./SearchPane";
import {FilterOptions} from "../../../service/filters/FilterOptions";
import {IDomainEntity} from "../../../interfaces/IDomainEntity";

export class SelectPane<T extends IDomainEntity> implements ClassComponent
{
    timeout:any;
    page:Page<T> = new Page<T>();
    loading:boolean = false;
    selectedItemId:number;
    selectedItem:T | undefined;
    currentPage:number = 0;
    paging:Paging;
    searchPane:SearchPane;
    url:string;
    active:boolean = false;
    buttonText:string;
    onItemSelected:(item:T) => void;
    
    constructor(url:string, buttonText: string, onItemSelected:(item:T) => void)
    {
        this.url = url;
        this.buttonText = buttonText;
        this.onItemSelected = onItemSelected;
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
    
    async fetch(filterOptions?:FilterOptions)
    {
        this.loading = true;
        try
        {
            const page = await m.request({
                method: "get",
                url: this.url,
                data: {page: this.currentPage, size: 15, s: filterOptions}
            });
            Object.assign(this.page, page);
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
        this.currentPage = targetPage;
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
        this.selectedItem = undefined;
        this.selectedItemId = 0;
    }
    
    view(vnode:Vnode):Children
    {
        return [
            m("a.button.is-primary.is-small", {onclick: this.open.bind(this)}, this.buttonText),
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