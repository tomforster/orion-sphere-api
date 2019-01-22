import {ItemType} from "../entity/ItemType";
import {Service} from "./Service";
import {FilterOptions} from "./filters/FilterOptions";

export class ItemTypeService extends Service<ItemType, FilterOptions>
{
    entityClass = ItemType;
}