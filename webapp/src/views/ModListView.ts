import {ListView} from "./ListView";
import {ItemType} from "../../../ItemType";
import {ModFilterOptions} from "../../../service/filters/ModFilterOptions";
import {IMod} from "../../../interfaces/IMod";

export class ModListView extends ListView<IMod, ModFilterOptions>
{
    filterOptions = {s:""};
    
    getColumns():string[]
    {
        return ["Description", "Max Stacks", "Restrictions"];
    }
    
    getRowTemplate():(mod:IMod) => (number | string)[]
    {
        return (mod:IMod) => [mod.description, mod.maxStacks, mod.restrictedTo.map(r => ItemType[<any> r]).join(", ")];
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