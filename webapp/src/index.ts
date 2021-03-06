import "./styles/app.less"
import "./styles/theme";
import {ItemListView} from "./views/ItemListView";
import {ItemModelListView} from "./views/ItemModelListView";
import {ModListView} from "./views/ModListView";
import {ItemDetailsView} from "./views/ItemDetailsView";
import {ModDetailsView} from "./views/ModDetailsView";
import {ItemModelDetailsView} from "./views/ItemModelDetailsView";
import "@fortawesome/fontawesome-free/css/solid.css";
import "@fortawesome/fontawesome-free/css/fontawesome.css";
import {AbilityDetailsView} from "./views/AbilityDetailsView";
import {AbilityListView} from "./views/AbilityListView";
import m from "mithril";

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
    
    content.addEventListener("click", (e) => {
        closeMenu();
        e.preventDefault();
        e.stopPropagation();
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
                    m("a[href=/mods].navbar-item", {id:"navbar-mods", oncreate: m.route.link}, "Mods"),
                    m("a[href=/abilities].navbar-item", {id:"navbar-abilities", oncreate: m.route.link}, "Abilities")
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
        "/abilities": new AbilityListView(),
        "/item/:key": new ItemDetailsView(),
        "/mod/:key": new ModDetailsView(),
        "/item-model/:key": new ItemModelDetailsView(),
        "/ability/:key": new AbilityDetailsView()
    });
})();