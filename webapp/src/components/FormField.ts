import m, {ClassComponent, Vnode} from "mithril";

export class FormField implements ClassComponent
{
    private name:string;
    private label:string;
    private content:Vnode;
    constructor(name:string, label:string, content:Vnode)
    {
        this.name = name;
        this.label = label;
        this.content = content;
    }
    view(vnode:Vnode)
    {
        return m("");
    }
}