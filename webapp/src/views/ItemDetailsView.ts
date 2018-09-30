import {DetailsView} from "./DetailsView";
import * as m from "mithril";
import {Vnode} from "mithril";
import {IItem} from "../../../interfaces/IItem";
import {IMod} from "../../../interfaces/IMod";
import {SelectPane} from "../components/SelectPane";
import {IItemModel} from "../../../interfaces/IItemModel";

export class ItemDetailsView extends DetailsView<IItem>
{
    modSelect:SelectPane<IMod>;
    modelSelect:SelectPane<IItemModel>;
    
    oninit(vnode:Vnode):any
    {
        this.modSelect = new SelectPane<IMod>("mods", (mod:IMod) => this.entity.mods.push(mod), undefined, "Add Mod");
        return super.oninit(vnode);
    }
    
    createEntity():IItem
    {
        return {
            id: 0,
            mods:[]
        };
    }
    
    getUrlPath():string
    {
        return "item";
    }
    
    getTitle():string
    {
        if(!this.id) return "Create Item";
        return this.loaded && (`${this.entity.itemModel && this.entity.itemModel.name} - ${this.entity.serial}`) || "Loading...";
    }
    
    getControls():Vnode[]
    {
        if (this.id && this.entity)
        {
            return [
                m(`a.button`, {href: `/lammie-html?ids=${this.entity.id}`, disabled: !this.entity}, "Print Lammie"),
                m(`a.button.is-danger`, {disabled: !this.entity}, "Delete"),
            ];
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
        if(!this.modelSelect)
            this.modelSelect = new SelectPane<IItemModel>("item-models", (model:IItemModel) => this.entity.itemModel = model, this.entity.itemModel);
        
        return m("form", [
            m(".field", m("label.label", "Item Model"), m(this.modelSelect)),
            m(".field", m("label.label", "Mods"), m("ul.with-bullets", this.entity.mods.map(mod => m("li", mod.description, m("a", {onclick: this.onRemoveButtonPress.bind(this, mod)}, " [Remove]"))))),
            m(this.modSelect),
            m(".field", {style:"margin-top:0.75em"}, m("label.label", "Abilities"), m("ul.with-bullets", this.entity.mods.map(mod => m("li", mod.ability && mod.ability.description)))),
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