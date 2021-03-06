import {DetailsView} from "./DetailsView";
import {IAbility} from "../../../interfaces/IAbility";
import m, {Vnode} from "mithril";

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
            m(".field", m("label.label", "Description"), m(".control", m("input.input[type=text]", {value: this.entity.description, oninput: (e:any) => this.entity.description = e.target.value}))),
            m(".field", m("label.label", "Charge Cost"), m(".control", m("input.input[type=number]", {min: 0, value: this.entity.chargeCost, oninput: (e:any) => this.entity.chargeCost = Number.parseInt(e.target.value)}))),
        ]);
    }
}