import {AbilityService} from "../service/AbilityService";
import {AuditService} from "../service/AuditService";
import {Route} from "./Route";

const abilityService = new AbilityService();
const auditService = new AuditService();

export const AbilityRoutes:Route[] = [
    {
        path: "/abilities",
        method: "get",
        isPaged: true,
        action: abilityService.findAll.bind(abilityService)
    },
    {
        path: "/abilities/:id",
        method: "get",
        action: abilityService.findById.bind(abilityService)
    },
    {
        path: "/abilities/:id",
        method: "put",
        action: abilityService.update.bind(abilityService)
    },
    {
        path: "/abilities",
        method: "post",
        action: abilityService.create.bind(abilityService)
    },
    {
        path: "/audits/abilities/:id",
        method: "get",
        isPaged: true,
        pagedById: true,
        action: auditService.findByEntityId.bind(auditService, "ability")
    }
];