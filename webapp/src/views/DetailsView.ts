import * as m from "mithril";
import {Children, Vnode} from "mithril";
import {View} from "./View";
import {DomainEntity} from "../../../entity/DomainEntity";
import {Audit} from "../../../entity/Audit";
import {Page} from "../../../app";
import {AuditType} from "../../../AuditType";

export abstract class DetailsView<T extends DomainEntity> extends View
{
    entity:T;
    audits:Page<Audit>;
    id:number;
    
    abstract getForm():Vnode;
    
    oninit(vnode:Vnode):any
    {
        this.id = (vnode.attrs as any).key;
        return super.oninit(vnode);
    }
    
    view(vnode:Vnode):Children | void | null
    {
        if(this.loaded)
        {
            return m(".container", this.getTitleBar(), this.getForm(), this.getHistoryPanel());
        }
        
        return super.view(vnode);
    }
    
    getAuditTypeString(type:AuditType)
    {
        switch(type)
        {
            case AuditType.insert: return "Created";
            case AuditType.update: return "Updated";
            case AuditType.delete: return "Deleted";
        }
    }
    
    getHistoryPanel():Children
    {
        return m(".field",  m("label.label", "History"), m(".box", this.audits.content.map(audit => m(".columns", [
            m(".column.is-narrow", new Date(audit.createdOn).toLocaleString()),
            m(".column.is-narrow", this.getAuditTypeString(audit.auditType)),
            m(".column", audit.description)
        ]))));
    }
    
    async fetch():Promise<any>
    {
        this.entity = await m.request<T>({
            method: "get",
            url:this.getUrl() + "/" + this.id
        });
        this.audits = await m.request<Page<Audit>>({
            method: "get",
            url:"/audits" + this.getUrl() + "/" + this.id
        });
        this.loaded = true;
    }
}