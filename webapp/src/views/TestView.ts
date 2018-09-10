import * as m from "mithril";
import {ClassComponent, Vnode} from "mithril";
import {IItemModel} from "../../../interfaces/IItemModel";

export class TestView implements ClassComponent
{
    value:string;
    timeout:any;
    results:IItemModel[] = [];
    loading:boolean = false;
    selectedItem:IItemModel;
    
    oninit(vnode:Vnode):any
    {
        this.onValueChange("");
    }
    
    onValueChange(value:string):any
    {
        this.loading = true;
        this.value = value;
        if(this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            if(!this.value)
            {
                this.results = [];
                m.redraw();
                this.loading = false;
                return;
            }
            m.request({method:"get", url:"/item-models", data:{s:{s:this.value}, page:0, size:5}})
                .then((r:any) => {
                    this.results = r.content;
                    m.redraw();
                    this.loading = false;
                }).catch(e => this.loading = false)
        }, 500);
    }
    
    onremove()
    {
        if(this.timeout) clearTimeout(this.timeout);
    }
    
    focused:boolean = false;
    
    onFocus()
    {
        this.focused = true;
    }
    
    onFocusOut()
    {
        this.focused = false;
    }
    
    onOptionPress(item:IItemModel)
    {
        this.selectedItem = item;
        this.focused = false;
    }
    
    view(vnode:Vnode)
    {
        return m(".container", [
            m(".field", {style: "margin-bottom: 0.5em"},
                m(".control", [
                    m("label.label.is-small", "Search Models"),
                    !this.selectedItem ?
                        m("input.input", {
                            value: this.value,
                            onfocusout: this.onFocusOut.bind(this),
                            onfocus: this.onFocus.bind(this),
                            oninput: m.withAttr("value", this.onValueChange.bind(this))
                        }) :
                        m("input.input", {
                            value: this.selectedItem.name,
                            readonly: true
                        })
                ])
            ),
            m("", {class: this.focused ? "" : "is-hidden"},
                this.value ?
                    this.loading ?
                        m("", "Loading...") :
                        this.results.length ?
                            this.results.map(r => m(".select-option", {onmousedown:this.onOptionPress.bind(this, r)}, r.name)) :
                            m("", "No results found.") :
                    m("", "Type to search..."))
            ]
        );
    }
}