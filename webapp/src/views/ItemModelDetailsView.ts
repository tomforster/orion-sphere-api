import {DetailsView} from "./DetailsView";
import m, {Vnode} from "mithril";
import {IItemModel} from "../../../interfaces/IItemModel";
import {SelectPane} from "../components/SelectPane";
import {IItemType} from "../../../interfaces/IItemType";

export class ItemModelDetailsView extends DetailsView<IItemModel>
{
    itemTypeSelect:SelectPane<IItemType>;
    
    async fetch():Promise<any>
    {
        await super.fetch();
        if(!this.itemTypeSelect)
        {
            this.itemTypeSelect = new SelectPane("item-types", undefined, (itemType) => this.entity.itemType = itemType, this.entity.itemType);
            this.itemTypeSelect.disabled = !!this.entity.id;
            m.redraw();
        }
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
            })))
        ]);
    }
}