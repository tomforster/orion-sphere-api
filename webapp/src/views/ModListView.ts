import {ListView} from "./ListView";
import {ItemType} from "../../../ItemType";
import {IMod} from "../../../interfaces/IMod";
import * as m from "mithril";

export class ModListView extends ListView<IMod>
{
    getCreateUrl():string
    {
        return "/mod/create";
    }
    
    getColumns():string[]
    {
        return ["Description", "Max Stacks", "Restrictions"];
    }
    
    getRowData(mod:IMod)
    {
        return [m("td", m(`a[href=/mod/${mod.id}]`, {oncreate: m.route.link}, mod.description)), m("td", mod.maxStacks || "Unlimited"), m("td", mod.restrictedTo.map(r => ItemType[<any> r]).join(", "))];
    }
    
    getUrlPath():string
    {
        return "mods";
    }
    
    getTitle():string
    {
        return "Mods";
    }
}