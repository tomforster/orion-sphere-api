import {ModService} from "../service/ModService";
import {AuditService} from "../service/AuditService";
import {Route} from "./Route";

const modService = new ModService();
const auditService = new AuditService();

export const ModRoutes:Route[] =
    [
        {
            path: "/mods",
            method: "get",
            isPaged: true,
            action: modService.findAll.bind(modService)
        },
        {
            path: "/mods/:id",
            method: "get",
            action: modService.findById.bind(modService)
        },
        {
            path: "/mods/:id",
            method: "put",
            action: modService.update.bind(modService)
        },
        {
            path: "/audits/mods/:id",
            method: "get",
            isPaged: true,
            pagedById: true,
            action: auditService.findByEntityId.bind(auditService, "mod")
        }
    ];