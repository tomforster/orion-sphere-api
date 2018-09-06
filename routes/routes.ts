import {ItemModelService} from "../service/ItemModelService";
import {ItemService} from "../service/ItemService";
import {ItemTypeService} from "../service/ItemTypeService";
import {ModService} from "../service/ModService";

const itemDefinitionService = new ItemModelService();
export const itemService = new ItemService();
const itemTypeService = new ItemTypeService();
const modService = new ModService();

export const Routes:{
    path:string,
    method:string,
    isPaged?: boolean,
    action: Function
}[] =
[
    {
        path: "/item-models",
        method: "post",
        action: itemDefinitionService.create.bind(itemDefinitionService)
    },
    {
        path: "/item-models",
        method: "get",
        isPaged: true,
        action: itemDefinitionService.findAll.bind(itemDefinitionService)
    },
    {
        path: "/item-models/:id",
        method: "patch",
        action: itemDefinitionService.update.bind(itemDefinitionService)
    },
    {
        path: "/item-models/:id",
        method: "get",
        action: itemDefinitionService.findById.bind(itemDefinitionService)
    },
    {
        path: "/item-models/:id",
        method: "delete",
        action: itemDefinitionService.delete.bind(itemDefinitionService)
    },
    {
        path: "/items",
        method: "get",
        isPaged: true,
        action: itemService.findAll.bind(itemService)
    },
    {
        path: "/mods",
        method: "get",
        isPaged: true,
        action: modService.findAll.bind(modService)
    },
    {
        path: "/item-type",
        method: "get",
        isPaged: true, //todo fix this
        action: itemTypeService.findAll.bind(itemTypeService)
    }
];