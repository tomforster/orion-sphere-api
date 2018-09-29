import {DetailsView} from "./DetailsView";
import * as m from "mithril";
import {Vnode} from "mithril";
import {IMod} from "../../../interfaces/IMod";
import {ItemTypeSelectPane} from "../components/ItemTypeSelectPane";

export class ModDetailsView extends DetailsView<IMod>
{
    itemTypeSelect:ItemTypeSelectPane;
    
    async fetch():Promise<any>
    {
        await super.fetch();
        if(!this.itemTypeSelect)
        {
            this.itemTypeSelect = new ItemTypeSelectPane(this.entity.restrictedTo);
            m.redraw();
        }
    }
    
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
            m(".field", m("label.label", "Description"), m(".control", m("input.input[type=text]", {value: this.entity.description, oninput: m.withAttr("value", (value) => this.entity.description = value)}))),
            m(".field", m("label.label", "Ability"), m(".control", m("input.input[type=text]", {value: this.entity.ability && this.entity.ability.description || "N/A", readonly:true}))),
            m(".field", m("label.label", "Max Stacks (0 = Unlimited)"), m(".control", m("input.input[type=number]", {value: this.entity.maxStacks, oninput: m.withAttr("value", (value) => this.entity.maxStacks = value)}))),
            this.itemTypeSelect ? m(".field", m("label.label", "Restricted To"), m(this.itemTypeSelect)) : m("")
        ]);
    }
}