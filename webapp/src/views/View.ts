import * as m from "mithril";
import {Children, ClassComponent, Vnode} from "mithril";
import {closeMenu} from "../index";

export abstract class View implements ClassComponent
{
    loaded:boolean = false;
    
    abstract getUrlPath():string;
    
    abstract getTitle():string;
    
    view(vnode:Vnode):Children | void | null
    {
        return m(".container", this.getTitleBar());
    }
    
    abstract async fetch():Promise<any>;
    
    getUrl():string
    {
        return "/" + this.getUrlPath();
    }
    
    getControls():Vnode[]
    {
        return [];
    }
    
    getTitleBar():Vnode
    {
        return m(".level",
            m(".level-left", m("h1.subtitle", this.getTitle())),
            m(".level-right", m(".buttons", this.getControls())));
    }
    
    oninit(vnode:Vnode):any
    {
        closeMenu();
        Array.from(document.querySelectorAll(".navbar-item")).forEach(element => element.classList.remove("active"));
        Array.from(document.querySelectorAll(`#navbar-${this.getUrlPath()}`)).forEach(element => element.classList.add("active"));
        this.fetch();
    }
}