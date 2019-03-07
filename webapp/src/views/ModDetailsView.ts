import {DetailsView} from "./DetailsView";
import m, {Vnode} from "mithril";
import {IMod} from "../../../interfaces/IMod";
import {SelectPane} from "../components/SelectPane";
import {IItemType} from "../../../interfaces/IItemType";
import {IAbility} from "../../../interfaces/IAbility";

export class ModDetailsView extends DetailsView<IMod>
{
    itemTypeSelect:SelectPane<IItemType>;
    abilitySelect:SelectPane<IAbility>;
    
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
            this.itemTypeSelect = new SelectPane<IItemType>("item-types", undefined, ((itemType:IItemType) =>
            {
                if(!this.entity.restrictedTo.find(rt => rt.id === itemType.id))
                {
                    this.entity.restrictedTo.push(itemType)
                }
                else
                {
                    this.entity.restrictedTo.splice(this.entity.restrictedTo.findIndex(rt => rt.id === itemType.id), 1);
                }
            }), undefined, "Add Item Type");
    
            this.abilitySelect = new SelectPane<IAbility>("abilities", undefined, ((ability:IAbility) =>
            {
                this.entity.ability = ability;
            }));
            
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
    
    onRemoveButtonPress(itemType:IItemType)
    {
    
    }
    
    getForm():Vnode
    {
        return m("form", [
            m(".field", m("label.label", "Description"), m(".control", m("input.input[type=text]", {value: this.entity.description, oninput: (e:any) => this.entity.description = e.target.value}))),
            m(".field", m("label.label", "Ability"), this.abilitySelect ? m(this.abilitySelect) : m("")),
            m(".field", m("label.label", "Max Stacks (0 = Unlimited)"), m(".control", m("input.input[type=number]", {min: 0, value: this.entity.maxStacks, oninput: (e:any) => this.entity.maxStacks = Number.parseInt(e.target.value)}))),
            m(".field", m("label.label", "Restricted To"), m("ul.with-bullets", this.entity.restrictedTo.map(r => m("li", [r.name, m("a", {onclick: this.onRemoveButtonPress.bind(this, r)}, " [Remove]")])))),
            this.itemTypeSelect ? m(this.itemTypeSelect) : m("")
        ]);
    }
}