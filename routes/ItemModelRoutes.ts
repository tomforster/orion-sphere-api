import {ItemModelService} from "../service/ItemModelService";
import {AuditService} from "../service/AuditService";
import {Route} from "./Route";

export const itemModelService = new ItemModelService();
const auditService = new AuditService();

export const ItemModelRoutes:Route[] =
    [
        {
            path: "/item-models",
            method: "post",
            action: itemModelService.create.bind(itemModelService)
        },
        {
            path: "/item-models",
            method: "get",
            isPaged: true,
            action: itemModelService.findAll.bind(itemModelService)
        },
        {
            path: "/item-models/:id",
            method: "put",
            action: itemModelService.update.bind(itemModelService)
        },
        {
            path: "/item-models/:id",
            method: "get",
            action: itemModelService.findById.bind(itemModelService)
        },
        {
            path: "/item-models/:id",
            method: "delete",
            action: itemModelService.delete.bind(itemModelService)
        },
        {
            path: "/audits/item-models/:id",
            method: "get",
            isPaged: true,
            pagedById: true,
            action: auditService.findByEntityId.bind(auditService, "item-model")
        }
    ];