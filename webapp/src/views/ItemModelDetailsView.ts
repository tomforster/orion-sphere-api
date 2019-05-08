import {DetailsView} from "./DetailsView";
import m, {Vnode} from "mithril";
import {IItemModel} from "../../../interfaces/IItemModel";
import {SelectPane} from "../components/SelectPane";
import {IItemType} from "../../../interfaces/IItemType";
import {IAbility} from "../../../interfaces/IAbility";

export class ItemModelDetailsView extends DetailsView<IItemModel>
{
    itemTypeSelect:SelectPane<IItemType>;
    abilitySelect:SelectPane<IAbility>;
    
    async fetch():Promise<any>
    {
        await super.fetch();
        if(!this.itemTypeSelect)
        {
            this.itemTypeSelect = new SelectPane("item-types", undefined, (itemType) => this.entity.itemType = itemType, this.entity.itemType);
            this.itemTypeSelect.disabled = !!this.entity.id;
            m.redraw();
        }
        
        this.abilitySelect = new SelectPane<IAbility>("abilities", undefined, (ability:IAbility) =>
        {
            const foundAbility = this.entity.abilities.find(a => a.id == ability.id);
            if (!foundAbility)
            {
                //else push
                this.entity.abilities.push(ability);
            }
        }, undefined, "Add Ability");
    }
    
    createEntity():IItemModel
    {
        return {
            id: 0,
            name: "",
            abilities: [],
            maintOnly: false,
            hasExoticSlot: true
        };
    }
    
    onRemoveButtonPress(ability:IAbility)
    {
        const index = this.entity.abilities.indexOf(ability);
        if(index > -1) this.entity.abilities.splice(index, 1);
        
    }
    
    getUrlPath():string
    {
        return "item-model";
    }
    
    getUrl():string
    {
        return "/item-models";
    }
    
    getTitle():string
    {
        if(!this.id) return "Create Model";
        return this.loaded && `${this.entity.name}` || "Loading...";
    }
    
    getForm():Vnode
    {
        return m("form", [
            m(".field", m("label.label", "Name"), m(".control", m("input.input[type=text]", {
                value: this.entity.name,
                oninput: (e:any) => this.entity.name = e.target.value
            }))),
            m(".field", m("label.label", "Item Type"),
                this.itemTypeSelect ? m(this.itemTypeSelect) : m("")
            ),
            m(".field", m("label.label", "Base Cost"), m(".control", m("input.input[type=number]", {
                value: this.entity.baseCost,
                oninput: (e:any) => this.entity.baseCost = Number(e.target.value)
            }))),
            m(".field", m("label.label", "Base Charge Capacity"), m(".control", m("input.input[type=number]", {
                value: this.entity.baseCharges,
                oninput: (e:any) => this.entity.baseCharges = Number(e.target.value)
            }))),
            m(".field", m("label.label", "Abilities"), m("ul.with-bullets", this.entity.abilities.map(ability => m("li", ability.description, m("a", {onclick: this.onRemoveButtonPress.bind(this, ability)}, " [Remove]"))))),
            this.abilitySelect ? m(this.abilitySelect) : m(""),
        ]);
    }
}