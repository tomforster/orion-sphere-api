import {ListView} from "./ListView";
import {IAbility} from "../../../interfaces/IAbility";
import * as m from "mithril";

export class AbilityListView extends ListView<IAbility>
{
    getCreateUrl():string
    {
        return "/ability/create";
    }
    
    getColumns():string[]
    {
        return ["Description", "Charge Cost"];
    }
    
    getRowData(ability:IAbility)
    {
        return [m("td", m(`a[href=/ability/${ability.id}]`, {oncreate: m.route.link}, ability.description)), m("td", ability.chargeCost)];
    }
    
    getUrlPath():string
    {
        return "abilities";
    }
    
    getTitle():string
    {
        return "Abilities";
    }
}