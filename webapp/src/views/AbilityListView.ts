import {ListView} from "./ListView";
import {IAbility} from "../../../interfaces/IAbility";
import m from "mithril";
import {ColumnHeader} from "../components/ColumnHeader";

export class AbilityListView extends ListView<IAbility>
{
    getCreateUrl():string
    {
        return "/ability/create";
    }
    
    getColumns():ColumnHeader[]
    {
        return [new ColumnHeader("Description", "description"),
            new ColumnHeader("Charge Cost", "chargeCost")];
    }
    
    getRowData(ability:IAbility)
    {
        return [m("td", m(`a[href=/ability/${ability.id}]`, {oncreate: m.route.link}, ability.description))];//, m("td", ability.chargeCost)];
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