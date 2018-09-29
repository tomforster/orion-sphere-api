import {DetailsView} from "./DetailsView";
import * as m from "mithril";
import {Vnode} from "mithril";
import {IItem} from "../../../interfaces/IItem";
import {IMod} from "../../../interfaces/IMod";
import {SelectPane} from "../components/SelectPane";

export class ItemDetailsView extends DetailsView<IItem>
{
    modSelect:SelectPane<IMod>;
    
    oninit(vnode:Vnode):any
    {
        this.modSelect = new SelectPane<IMod>("mods", "Add Mod", (mod:IMod) => this.entity.mods.push(mod));
        return super.oninit(vnode);
    }
    
    getUrlPath():string
    {
        return "item";
    }
    
    getTitle():string
    {
        return this.loaded && (`${this.entity.itemModel.name} - ${this.entity.serial}`) || "Loading...";
    }
    
    getControls():Vnode|Vnode[]
    {
        if (this.entity)
        {
            return m(".buttons", [
                m(`a.button`, {href: `/lammie-html?ids=${this.entity.id}`, disabled: !this.entity}, "Print Lammie"),
                m(`a.button.is-danger`, {disabled: !this.entity}, "Delete"),
            ]);
        }
        
        return super.getControls();
    }
    
    onRemoveButtonPress(mod:IMod)
    {
        const index = this.entity.mods.indexOf(mod);
        if(index > -1)
        {
            this.entity.mods.splice(index, 1);
        }
    }
    
    getForm():Vnode
    {
        return m("form", [
            m(".field", m("label.label", "Item Model"), m(".control", m("input.input[type=text]", {value: this.entity.itemModel.name, readonly:true}))),
            m(".field", m("label.label", "Mods"), m("ul.with-bullets", this.entity.mods.map(mod => m("li", mod.description, m("a", {onclick: this.onRemoveButtonPress.bind(this, mod)}, " [Remove]"))))),
            m(this.modSelect),
            m(".field", {style:"margin-top:0.75em"}, m("label.label", "Abilities"), m("ul.with-bullets", this.entity.mods.map(mod => m("li", mod.ability.description)))),
            //todo: dynamic update these
            // m(".field", m("label.label", "Maintenance Cost"), m(".control", m("input.input[type=text]", {value: this.entity.maintenanceCost, readonly:true}))),
            // m(".field", m("label.label", "Mod Cost"), m(".control", m("input.input[type=text]", {value: this.entity.modCost, readonly:true}))),
        ]);
    }
    
    getUrl():string
    {
        return "/items";
    }
}