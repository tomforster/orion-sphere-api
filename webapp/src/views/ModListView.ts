import {ListView} from "./ListView";
import {Mod} from "../index";

export class ModListView extends ListView<Mod>
{
    getColumns():string[]
    {
        return ["Mod Type", "Description", "Max Stacks"];
    }
    
    getRowTemplate():(item:Mod) => (number | string)[]
    {
        return (item:Mod) => [item.modType, item.description, item.maxStacks];
    }
    
    getUrlPath():string
    {
        return "mod";
    }
    
    getTitle():string
    {
        return "Mods";
    }
}