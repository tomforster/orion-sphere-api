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

(async function init()
{
    m.route(document.getElementById("content") as Element, "/item-models/1", {
        "/item-models/:key": new ItemModelListView(),
        "/items/:key": new ItemListView(),
        "/mods/:key": new ModListView(),
    });
    
    m.render(document.getElementById("nav") as Element, [
        m(".navbar-brand", m("a.navbar-item", m("h1.subtitle", "OSLRP Admin"))),
        m(".navbar-menu",
            [
                m(".navbar-start",
                    [
                        m("a[href=/item-models/1].navbar-item.is-tab", {oncreate: m.route.link}, "Models"),
                        m("a[href=/items/1].navbar-item.is-tab", {oncreate: m.route.link}, "Items"),
                        m("a[href=/mods/1].navbar-item.is-tab", {oncreate: m.route.link}, "Mods")
            
                    ]
                ),
                m(".navbar-end", m(".navbar-item", m(".field", m(".control", m("a.button.is-link", "Create Item")))))
            ]
        )
    ]);
        
    // m("a.navbar-burger", [
    //     m("span", "Models"),
    //     m("span", "Items"),
    //     m("span", "Mods"),
    // ])
})();