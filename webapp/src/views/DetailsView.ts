import m, {Children, Vnode} from "mithril";
import {View} from "./View";
import {Page} from "../../../service/filters/Page";
import {AuditType} from "../../../AuditType";
import {IDomainEntity} from "../../../interfaces/IDomainEntity";
import {IAudit} from "../../../interfaces/IAudit";

export abstract class DetailsView<T extends IDomainEntity> extends View
{
    entity:T;
    audits:Page<IAudit>;
    id:number;
    
    abstract getForm():Vnode;
    
    oninit(vnode:Vnode):any
    {
        if((vnode.attrs as any).key === "create")
        {
            this.id = 0;
        }
        else
        {
            this.id = (vnode.attrs as any).key;
        }
        return super.oninit(vnode);
    }
    
    view(vnode:Vnode):Children | void | null
    {
        if(this.loaded)
        {
            return m(".container", this.getTitleBar(), this.getForm(), this.getHistoryPanel(), this.getSaveButtons());
        }
        return super.view(vnode);
    }
    
    async onSavePressed()
    {
        let promise;
        if(this.id)
        {
            promise = m.request({
                method: "put",
                url: this.getUrl() + "/" + this.id,
                data: this.entity
            }).then(() =>
            {
                location.reload();
            })
        }
        else
        {
            promise = m.request({
                method: "post",
                url: this.getUrl(),
                data: this.entity
            }).then(result =>
            {
                m.route.set("/" + this.getUrlPath() + "/" + (<any>result).id);
            })
        }
        
        promise.catch(err => {
            if(err.message === "Bad Request")
            {
                const validation:{property:string, constraints:{[s:string]:string}}[] = err.error;
                console.log(validation);
            }
            else
            {
                console.error(err);
            }
        })
    }
    
    getSaveButtons()
    {
        return m(".level", [m(".level-left"), m(".level-right", m(".buttons", m("button.button.is-primary", {onclick:this.onSavePressed.bind(this)}, "Save")))]);
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
        return this.id ? m(".field",  m("label.label", "History"), m(".box", this.audits.content.map(audit => m(".columns", [
            m(".column.is-narrow", new Date(audit.createdOn).toLocaleString()),
            m(".column.is-narrow", this.getAuditTypeString(audit.auditType)),
            m(".column", audit.description)
        ])))) : m("");
    }
    
    abstract createEntity():T;
    
    async fetch():Promise<any>
    {
        if(!this.id)
        {
            this.entity = this.createEntity();
            this.loaded = true;
            return;
        }
        this.entity = await m.request<T>({
            method: "get",
            url:this.getUrl() + "/" + this.id
        });
        this.audits = await m.request<Page<IAudit>>({
            method: "get",
            url:"/audits" + this.getUrl() + "/" + this.id
        });
        this.loaded = true;
    }
}