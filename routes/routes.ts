import {ItemDefinitionService} from "../service/ItemDefinitionService";
import {ItemService} from "../service/ItemService";
import {ItemTypeService} from "../service/ItemTypeService";

const itemDefinitionService = new ItemDefinitionService();
const itemService = new ItemService();
const itemTypeService = new ItemTypeService();

export const Routes:{
    path:string,
    method:string,
    isPaged?: boolean,
    action: Function
}[] =
[
    {
        path: "/item-definition",
        method: "post",
        action: itemDefinitionService.create.bind(itemDefinitionService)
    },
    {
        path: "/item-definition",
        method: "get",
        isPaged: true,
        action: itemDefinitionService.findAll.bind(itemDefinitionService)
    },
    {
        path: "/item-definition/:id",
        method: "patch",
        action: itemDefinitionService.update.bind(itemDefinitionService)
    },
    {
        path: "/item-definition/:id",
        method: "get",
        action: itemDefinitionService.findById.bind(itemDefinitionService)
    },
    {
        path: "/item-definition/:id",
        method: "delete",
        action: itemDefinitionService.delete.bind(itemDefinitionService)
    },
    {
        path: "/item",
        method: "get",
        isPaged: true,
        action: itemService.findAll.bind(itemService)
    },
    {
        path: "/item-type",
        method: "get",
        isPaged: true,
        action: itemTypeService.findAll.bind(itemTypeService)
    }
];