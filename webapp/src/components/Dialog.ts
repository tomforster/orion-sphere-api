import m, {Children, ClassComponent, Vnode} from "mithril";

export class Dialog implements ClassComponent
{
    active:boolean;
    
    onClosePress()
    {
        this.active = false;
    }
    
    view(vnode:Vnode):Children
    {
        return [
            m(".modal.dialog", {class: this.active ? "is-active" : ""}, [
                m(".modal-background", {onclick: this.onClosePress.bind(this)}),
                m(".modal-card", [
                    m(".modal-card-body", "Are you sure you want to delete this?"),
                    m("footer.modal-card-foot", {style: "justify-content: flex-end; padding: 10px;"}, [
                        m("button.button", {onclick: this.onClosePress.bind(this)}, "Cancel"),
                        m("button.button.is-danger", "OK")
                    ])
                ]),
                m("button.modal-close.is-large", {onclick: this.onClosePress.bind(this)})
            ])];
    }
}