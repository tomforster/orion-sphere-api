import {DetailsView} from "./DetailsView";
import * as m from "mithril";
import {Vnode} from "mithril";
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
            this.itemTypeSelect = new SelectPane("item-types", undefined, (itemType) => this.entity.itemType = itemType);
            m.redraw();
        }
    }
    
    createEntity():IItemModel
    {
        return {
            id: 0,
            name: "",
            abilities: []
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
                oninput: m.withAttr("value", (value) => this.entity.name = value)
            }))),
            m(".field", m("label.label", "Item Type"),
                this.itemTypeSelect ? m(this.itemTypeSelect) : m("")
            ),
            m(".field", m("label.label", "Base Cost"), m(".control", m("input.input[type=number]", {
                value: this.entity.baseCost,
                oninput: m.withAttr("value", (value) => this.entity.baseCost = Number(value))
            }))),
            m(".field", m("label.label", "Base Charge Capacity"), m(".control", m("input.input[type=number]", {
                value: this.entity.baseCharges,
                oninput: m.withAttr("value", (value) => this.entity.baseCharges = Number(value))
            })))
        ]);
    }
}