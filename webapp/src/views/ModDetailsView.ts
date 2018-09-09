import {DetailsView} from "./DetailsView";
import * as m from "mithril";
import {Vnode} from "mithril";
import {IMod} from "../../../interfaces/IMod";
import {ItemType} from "../../../ItemType";

export class ModDetailsView extends DetailsView<IMod>
{
    getUrlPath():string
    {
        return "mod";
    }
    
    getUrl():string
    {
        return "/mods";
    }
    
    getTitle():string
    {
        return this.loaded && `${this.entity.description}` || "Loading...";
    }
    
    getForm():Vnode
    {
        return m("form", [
            m(".field", m("label.label", "Description"), m(".control", m("input.input[type=text]", {value: this.entity.description, readonly:true}))),
            m(".field", m("label.label", "Ability"), m(".control", m("input.input[type=text]", {value: this.entity.ability && this.entity.ability.description || "N/A", readonly:true}))),
            m(".field", m("label.label", "Max Stacks"), m(".control", m("input.input[type=text]", {value: this.entity.maxStacks ? this.entity.maxStacks : "Unlimited", readonly:true}))),
            m(".field", m("label.label", "Restricted To"), m(".control", m("input.input[type=text]", {value: this.entity.restrictedTo.map(r => ItemType[<any> r]).join(", "), readonly:true})))
        ]);
    }
}