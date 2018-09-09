import {AuditType} from "../AuditType";

export interface IAudit
{
    id:number;
    auditType:AuditType;
    createdOn:number;
    itemId:number;
    itemModelId:number;
    modId:number;
    abilityId:number;
    description:string;
}