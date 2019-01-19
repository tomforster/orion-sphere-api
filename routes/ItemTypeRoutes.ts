import {ItemTypeService} from "../service/ItemTypeService";
import {Route} from "./Route";

const itemTypeService = new ItemTypeService();

export const ItemTypeRoutes:Route[] =
    [
        {
            path: "/item-types",
            method: "get",
            isPaged: true,
            action: itemTypeService.findAll.bind(itemTypeService)
        }
    ];