import {DetailsView} from "./DetailsView";
import * as m from "mithril";
import {Vnode} from "mithril";
import {IItemModel} from "../../../interfaces/IItemModel";
import {ItemType} from "../../../ItemType";

export class ItemModelDetailsView extends DetailsView<IItemModel>
{
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
        return this.loaded && `${this.entity.name}` || "Loading...";
    }
    
    getForm():Vnode
    {
        return m("form", [
            m(".field", m("label.label", "Name"), m(".control", m("input.input[type=text]", {value: this.entity.name, readonly:true}))),
            m(".field", m("label.label", "Item Type"), m(".control", m("input.input[type=text]", {value: ItemType[<any>this.entity.itemType], readonly:true}))),
            m(".field", m("label.label", "Base Cost"), m(".control", m("input.input[type=number]", {value: this.entity.baseCost, readonly:true}))),
            m(".field", m("label.label", "Base Charges"), m(".control", m("input.input[type=number]", {value: this.entity.baseCharges, readonly:true})))
        ]);
    }
}