import * as m from "mithril";
import "./styles/app.less"
import "bulma/css/bulma.css";
import {ItemListView} from "./views/ItemListView";
import {ItemModelListView} from "./views/ItemModelListView";
import {ModListView} from "./views/ModListView";
import {ItemDetailsView} from "./views/ItemDetailsView";
import {ModDetailsView} from "./views/ModDetailsView";
import {ItemModelDetailsView} from "./views/ItemModelDetailsView";
import {SelectPane} from "./components/SelectPane";

let menuButtonElement:Element;
let menuElement:Element;
let menuToggled = false;

export function openMenu()
{
    if(menuElement && menuButtonElement)
    {
        menuButtonElement.classList.add("is-active");
        menuElement.classList.add("is-active");
        menuToggled = true;
    }
}

export function closeMenu()
{
    if(menuElement && menuButtonElement)
    {
        menuButtonElement.classList.remove("is-active");
        menuElement.classList.remove("is-active");
        menuToggled = false;
    }
}

(async function init()
{
    const content = document.getElementById("content") as Element;
    
    content.addEventListener("click", () => {
        closeMenu();
    });
    
    let menuClick = function()
    {
        if(menuToggled)
        {
            closeMenu();
        }
        else if(!menuToggled)
        {
            openMenu();
        }
    };
    
    const menuButton = m("a.navbar-burger#menu-button", {onclick: menuClick}, [m("span"),m("span"),m("span")]);
    const menu = m(".navbar-menu#menu",
        [
            m(".navbar-start",
                [
                    m("a[href=/item-models].navbar-item", {id:"navbar-item-models", oncreate: m.route.link}, "Models"),
                    m("a[href=/items].navbar-item", {id:"navbar-items", oncreate: m.route.link}, "Items"),
                    m("a[href=/mods].navbar-item", {id:"navbar-mods", oncreate: m.route.link}, "Mods")
                ]
            )
        ]
    );
    
    m.render(document.getElementById("nav") as Element, [
        m(".navbar-brand", [
            m("a.navbar-item", m("h1.subtitle", "OSLRP Admin")),
            menuButton
        ]),
        menu
    ]);
    
    menuButtonElement = (<any>menuButton).dom;
    menuElement = (<any>menu).dom;
    
    m.route(content, "/item-models", {
        "/item-models": new ItemModelListView(),
        "/items": new ItemListView(),
        "/mods": new ModListView(),
        "/item/:key": new ItemDetailsView(),
        "/mod/:key": new ModDetailsView(),
        "/item-model/:key": new ItemModelDetailsView(),
        "/test": new SelectPane()
    });
})();