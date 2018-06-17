import {ItemDefinitionService} from "../service/ItemDefinitionService";
import {ItemService} from "../service/ItemService";

const itemDefinitionService = new ItemDefinitionService();
const itemService = new ItemService();

export const Routes:{
    path:string,
    method:string,
    isPaged?: boolean,
    action: (params:any) => Promise<any>
}[] =
[
    {
        path: "/item-definitions",
        method: "post",
        action: itemDefinitionService.create.bind(itemDefinitionService)
    },
    {
        path: "/item-definitions",
        method: "get",
        isPaged: true,
        action: itemDefinitionService.findAll.bind(itemDefinitionService)
    },
    {
        path: "/item-definitions/:id",
        method: "patch",
        action: itemDefinitionService.update.bind(itemDefinitionService)
    },
    {
        path: "/item-definitions/:id",
        method: "get",
        action: itemDefinitionService.findById.bind(itemDefinitionService)
    },
    {
        path: "/item-definitions/:id",
        method: "delete",
        action: itemDefinitionService.delete.bind(itemDefinitionService)
    },
    {
        path: "/items",
        method: "get",
        isPaged: true,
        action: itemService.findAll.bind(itemService)
    }
];