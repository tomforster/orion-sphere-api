import * as m from "mithril";
import "./styles/app.less"
import "bulma/css/bulma.css";
import {ItemListView} from "./views/ItemListView";
import {ItemModelListView} from "./views/ItemModelListView";
import {ModListView} from "./views/ModListView";

export interface Page<T> {
    content:T[];
    number:number;
    size:number;
    first:boolean;
    last:boolean;
    totalPages:number;
}

export interface DomainObject
{
    id:number;
    type:string;
}

export interface Item extends DomainObject
{
    itemModel:ItemModel | undefined;
    serial:string;
}

export interface ItemModel extends DomainObject
{
    itemType:string | undefined;
    name:string;
    baseCost:number;
}

export interface ItemType
{
    key:string;
    name:string;
}

export interface Mod extends DomainObject
{
    modType:string;
    description:string;
    maxStacks:number;
}

(async function init()
{
    const itemTypePromise = m.request({url:"/item-type", method:"get"})
        .then(res => res as ItemType[]);
    
    m.route(document.getElementById("content") as Element, "/item-model/1", {
        "/item-model/:key": new ItemModelListView(itemTypePromise),
        "/item/:key": new ItemListView(itemTypePromise),
        "/mod/:key": new ModListView(itemTypePromise),
    });
    
    m.render(document.getElementById("nav") as Element, m(".navbar-brand", [
        m("a.navbar-item", m("h1.subtitle", "OSLRP Admin")),
        m("a[href=/item-model/1].navbar-item", {oncreate: m.route.link}, "Models"),
        m("a[href=/item/1].navbar-item", {oncreate: m.route.link}, "Items"),
        m("a[href=/mod/1].navbar-item", {oncreate: m.route.link}, "Mods"),
        
        // m("a.navbar-burger", [
        //     m("span", "Models"),
        //     m("span", "Items"),
        //     m("span", "Mods"),
        // ])
    ]));
})();