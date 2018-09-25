import * as m from "mithril";
import {ClassComponent, Vnode} from "mithril";
import {FilterOptions} from "../../../service/filters/FilterOptions";

export class SearchPane implements ClassComponent
{
    protected filterOptions:FilterOptions;
    protected onSearchPressed:(filterOptions:FilterOptions) => void;
    
    constructor(filterOptions:FilterOptions, onSearchPressed:(filterOptions:FilterOptions) => void)
    {
        this.filterOptions = filterOptions;
        this.onSearchPressed = onSearchPressed;
    }
    
    setSearchField(searchField:string):void
    {
        this.filterOptions.s = searchField;
    }
    
    view():Vnode[]
    {
        return [m(".field.has-addons", [
            m('.control.is-expanded', m("input.input[type='text']", {
                value: this.filterOptions.s,
                placeholder: 'Type to filter...',
                oninput: m.withAttr("value", this.setSearchField.bind(this))
            })),
            m('.control', m("a.button.is-primary", {onclick: this.onSearchPressed.bind(this)}, "Search"))
        ])];
    }
}