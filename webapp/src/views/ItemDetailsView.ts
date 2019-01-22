import {DetailsView} from "./DetailsView";
import * as m from "mithril";
import {Children, Vnode} from "mithril";
import {IItem} from "../../../interfaces/IItem";
import {IMod} from "../../../interfaces/IMod";
import {SelectPane} from "../components/SelectPane";
import {IItemModel} from "../../../interfaces/IItemModel";
import {IItemMod} from "../../../interfaces/IItemMod";
import {ModFilterOptions} from "../../../service/filters/ModFilterOptions";

export class ItemDetailsView extends DetailsView<IItem>
{
    modSelect:SelectPane<IMod>;
    modelSelect:SelectPane<IItemModel>;
    
    oninit(vnode:Vnode):any
    {
        return super.oninit(vnode);
    }
    
    
    view(vnode:Vnode):Children | void | null
    {
        if(this.entity && this.entity.itemModel && this.entity.itemModel.itemType && !this.modSelect)
        {
            this.modSelect = new SelectPane<IMod>("mods", <ModFilterOptions>{itemTypeId: this.entity.itemModel.itemType.id}, (mod:IMod) =>
            {
                //if mod is already in the list, increment its count
                const foundMod = this.entity.itemMods.find(im => im.mod.id == mod.id);
                if (foundMod)
                {
                    foundMod.count++;
                }
                else
                {
                    //else push
                    this.entity.itemMods.push({id: 0, mod, count: 1})
                }
            }, undefined, "Add Mod");
        }
        return super.view(vnode);
    }
    
    createEntity():IItem
    {
        return {
            id: 0,
            itemMods:[]
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
    
    onRemoveButtonPress(itemMod:IItemMod)
    {
        itemMod.count--;
        
        if(!itemMod.count)
        {
            const index = this.entity.itemMods.indexOf(itemMod);
    
            if (index > -1)
            {
                this.entity.itemMods.splice(index, 1);
            }
        }
    }
    
    getForm():Vnode
    {
        if(!this.modelSelect)
            this.modelSelect = new SelectPane<IItemModel>("item-models", undefined, (model:IItemModel) => this.entity.itemModel = model, this.entity.itemModel);
        
        return m("form", [
            m(".field", m("label.label", "Item Model"), m(this.modelSelect)),
            m(".field", m("label.label", "Mods"), m("ul.with-bullets", this.entity.itemMods.map(itemMod => m("li", itemMod.mod.description + (itemMod.count > 1 ? ` (${itemMod.count})` : ""), m("a", {onclick: this.onRemoveButtonPress.bind(this, itemMod)}, " [Remove]"))))),
            this.modSelect ? m(this.modSelect) : m(""),
            m(".field", {style:"margin-top:0.75em"}, m("label.label", "Abilities"), m("ul.with-bullets", this.entity.itemMods.map(itemMod => m("li", itemMod.mod.ability && itemMod.mod.ability.description)))),
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