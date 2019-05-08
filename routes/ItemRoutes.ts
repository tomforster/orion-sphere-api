import {ItemService} from "../service/ItemService";
import {AuditService} from "../service/AuditService";
import {Route} from "./Route";
import {ImportService} from "../service/ImportService";

export const itemService = new ItemService();
export const importService = new ImportService();
const auditService = new AuditService();

export const ItemRoutes:Route[] = [
    {
        path: "/items",
        method: "get",
        isPaged: true,
        action: itemService.findAll.bind(itemService)
    },
    {
        path: "/items/:id",
        method: "get",
        action: itemService.findById.bind(itemService)
    },
    {
        path: "/items/:id",
        method: "put",
        action: itemService.update.bind(itemService)
    },
    {
        path: "/items/:id",
        method: "delete",
        action: itemService.delete.bind(itemService)
    },
    {
        path: "/items",
        method: "post",
        action: itemService.create.bind(itemService)
    },
    {
        path: "/item-import",
        method: "post",
        action: importService.import.bind(importService)
    },
    {
        path: "/audits/items/:id",
        method: "get",
        isPaged: true,
        pagedById: true,
        action: auditService.findByEntityId.bind(auditService, "item")
    }
];