import * as m from "mithril";
import {ClassComponent, Vnode} from "mithril";
import {IItemModel} from "../../../interfaces/IItemModel";

export class TestView implements ClassComponent
{
    value:string;
    timeout:any;
    results:IItemModel[] = [];
    
    oninit(vnode:Vnode):any
    {
    
    }
    
    onValueChange(value:string):any
    {
        this.value = value;
        if(this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            if(!this.value)
            {
                this.results = [];
                m.redraw();
                return;
            }
            m.request({method:"get", url:"/item-models", data:{s:{s:this.value}, page:0, size:10}})
                .then((r:any) => {
                    this.results = r.content;
                    m.redraw();
                });
        }, 500);
    }
    
    onremove()
    {
        if(this.timeout) clearTimeout(this.timeout);
    }
    
    view(vnode:Vnode)
    {
        return m(".container", m(".box", [
            m(".field", m(".control", m("input.input", {value: this.value, oninput: m.withAttr("value", this.onValueChange.bind(this))}))),
            ...this.results.map(r => m("", r.name))
            ])
        );
    }
}