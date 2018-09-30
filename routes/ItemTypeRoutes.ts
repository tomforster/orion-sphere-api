import {ItemTypeService} from "../service/ItemTypeService";
import {Route} from "./Route";

const itemTypeService = new ItemTypeService();

export const ItemTypeRoutes:Route[] =
    [
        {
            path: "/item-type",
            method: "get",
            isPaged: true, //todo fix this
            action: itemTypeService.findAll.bind(itemTypeService)
        }
    ];