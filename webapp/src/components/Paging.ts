import m, {ClassComponent, Vnode} from "mithril";
import {Page} from "../../../service/filters/Page";

export class Paging implements ClassComponent
{
    constructor(protected page:Page<any>, protected changePage:(targetPage:number) => void){}
    
    onNextPress()
    {
        if(!this.page.last)
        {
            this.changePage(this.page.number + 1);
        }
    }
    
    onFirstPress()
    {
        if(!this.page.first)
        {
            this.changePage(0);
        }
    }
    
    onLastPress()
    {
        if(!this.page.last)
        {
            this.changePage(this.page.totalPages-1);
        }
    }
    
    onPreviousPress()
    {
        if(!this.page.first)
        {
            this.changePage(this.page.number - 1);
        }
    }
    
    view():Vnode
    {
        return m(".columns", [
            m(".column.is-narrow", m(`button.button`, {disabled: this.page.first, onclick: this.onFirstPress.bind(this)}, "First")),
            m(".column.is-narrow", m(`button.button`, {disabled: this.page.first, onclick: this.onPreviousPress.bind(this)}, "Previous")),
            m(".column.is-vcentered.is-flex", {style: "justify-content: center"}, `${this.page.number+1}/${this.page.totalPages || 1}`),
            m(".column.is-narrow", m(`button.button`, {disabled: this.page.last, onclick: this.onNextPress.bind(this)}, "Next")),
            m(".column.is-narrow", m(`button.button`, {disabled: this.page.last, onclick: this.onLastPress.bind(this)}, "Last"))
        ]);
    }
}