import {DetailsView} from "./DetailsView";
import * as m from "mithril";
import {Vnode} from "mithril";
import {IMod} from "../../../interfaces/IMod";
import {SelectPane} from "../components/SelectPane";
import {IItemType} from "../../../interfaces/IItemType";

export class ModDetailsView extends DetailsView<IMod>
{
    itemTypeSelect:SelectPane<IItemType>;
    
    createEntity():IMod
    {
        return {
            id: 0,
            description: "",
            restrictedTo: []
        };
    }
    
    async fetch():Promise<any>
    {
        await super.fetch();
        if(!this.itemTypeSelect)
        {
            this.itemTypeSelect = new SelectPane("item-types",undefined, (itemType:IItemType) =>
            {
                if(this.entity.restrictedTo.find(rt => rt.id === itemType.id))
                {
                    this.entity.restrictedTo.push(itemType)
                }
            }, undefined, "Add Item Type");
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
        if(!this.id) return "Create Mod";
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