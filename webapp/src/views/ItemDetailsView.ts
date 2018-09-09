import {DetailsView} from "./DetailsView";
import {Item} from "../../../entity/Item";
import * as m from "mithril";
import {Vnode} from "mithril";

export class ItemDetailsView extends DetailsView<Item>
{
    getUrlPath():string
    {
        return "item";
    }
    
    getTitle():string
    {
        return this.entity && (`${this.entity.itemModel.name} - ${this.entity.serial}`) || "Item";
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
    
    getForm():Vnode
    {
        return m("form", [
            m(".field", m("label.label", "Item Model"), m(".control", m("input.input[type=text]", {value: this.entity.itemModel.name, readonly:true}))),
            m(".field", m("label.label", "Mods"), m("ul.with-bullets", this.entity.mods.map(mod => m("li", mod.description)))),
            m(".field", m("label.label", "Abilities"), m("ul.with-bullets", this.entity.mods.map(mod => m("li", mod.ability.description))))
        ]);
    }
    
    getUrl():string
    {
        return "/items";
    }
}