import m, {Children, ClassComponent, Vnode} from "mithril";

export class Dialog implements ClassComponent
{
    active:boolean;
    
    onClosePress()
    {
    
    }
    
    view(vnode:Vnode):Children
    {
        return [
            m(".modal.dialog", {class: this.active ? "is-active" : ""}, [
                m(".modal-background", {onclick: this.onClosePress.bind(this)}),
                m(".modal-content", m(".box", [
                
                ])),
                m("button.modal-close.is-large", {onclick: this.onClosePress.bind(this)})
            ])];
    }
}