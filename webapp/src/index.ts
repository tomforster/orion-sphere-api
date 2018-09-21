import * as m from "mithril";
import "./styles/app.less"
import "bulma/css/bulma.css";
import {ItemListView} from "./views/ItemListView";
import {ItemModelListView} from "./views/ItemModelListView";
import {ModListView} from "./views/ModListView";
import {ItemDetailsView} from "./views/ItemDetailsView";
import {ModDetailsView} from "./views/ModDetailsView";
import {ItemModelDetailsView} from "./views/ItemModelDetailsView";
import {TestView} from "./views/TestView";

(async function init()
{
    let menuToggled = false;
    
    let menuClick = function()
    {
        menuToggled = !menuToggled;
        const menuButton = document.getElementById("menu-button");
        const menu = document.getElementById("menu");
        if(menuButton && menu && menuToggled)
        {
            menuButton.classList.add("is-active");
            menu.classList.add("is-active");
        }
        else if(menuButton && menu && !menuToggled)
        {
            menuButton.classList.remove("is-active");
            menu.classList.remove("is-active");
        }
    };
    
    m.render(document.getElementById("nav") as Element, [
        m(".navbar-brand", [
            m("a.navbar-item", m("h1.subtitle", "OSLRP Admin")),
            m("a.navbar-burger#menu-button", {onclick: menuClick}, [m("span"),m("span"),m("span")])
        ]),
        m(".navbar-menu#menu",
            [
                m(".navbar-start",
                    [
                        m("a[href=/item-models/1].navbar-item", {id:"navbar-item-models", oncreate: m.route.link}, "Models"),
                        m("a[href=/items/1].navbar-item", {id:"navbar-items", oncreate: m.route.link}, "Items"),
                        m("a[href=/mods/1].navbar-item", {id:"navbar-mods", oncreate: m.route.link}, "Mods")
                    ]
                ),
                // m(".navbar-end", m(".navbar-item", m(".field", m(".control", m("a.button.is-link", "Create Item")))))
            ]
        )
    ]);
    
    m.route(document.getElementById("content") as Element, "/item-models/1", {
        "/item-models/:key": new ItemModelListView(),
        "/items/:key": new ItemListView(),
        "/mods/:key": new ModListView(),
        "/item/:key": new ItemDetailsView(),
        "/mod/:key": new ModDetailsView(),
        "/item-model/:key": new ItemModelDetailsView(),
        "/test": new TestView()
    });
})();