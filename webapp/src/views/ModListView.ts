import {ListView} from "./ListView";
import {Mod} from "../../../entity/Mod";
import {ItemType} from "../../../ItemType";

export class ModListView extends ListView<Mod>
{
    getColumns():string[]
    {
        return ["Description", "Max Stacks", "Restrictions"];
    }
    
    getRowTemplate():(mod:Mod) => (number | string)[]
    {
        return (mod:Mod) => [mod.description, mod.maxStacks, mod.restrictedTo.map(r => ItemType[<any> r]).join(", ")];
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