import {DetailsView} from "./DetailsView";
import {IAbility} from "../../../interfaces/IAbility";
import * as m from "mithril";
import {Vnode} from "mithril";

export class AbilityDetailsView extends DetailsView<IAbility>
{
    createEntity():IAbility
    {
        return {
            id: 0,
            description: ""
        };
    }
    
    getUrlPath():string
    {
        return "ability";
    }
    
    getUrl():string
    {
        return "/abilities";
    }
    
    getTitle():string
    {
        if(!this.id) return "Create Ability";
        return this.loaded && `${this.entity.description}` || "Loading...";
    }
    
    getForm():Vnode
    {
        return m("form", [
            m(".field", m("label.label", "Description"), m(".control", m("input.input[type=text]", {value: this.entity.description, oninput: m.withAttr("value", (value) => this.entity.description = value)}))),
            m(".field", m("label.label", "Charge Cost"), m(".control", m("input.input[type=text]", {value: this.entity.chargeCost}))),
        ]);
    }
}