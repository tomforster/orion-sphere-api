import * as m from "mithril";
import {Children, ClassComponent} from "mithril";
import {FilterOptions} from "../../../service/filters/FilterOptions";

export class SearchPane implements ClassComponent
{
    protected filterOptions:FilterOptions = {s:""};
    protected onFilterOptionsChanged:(filterOptions:FilterOptions) => void;
    protected timeout:any;
    
    constructor(onFilterOptionsChanged:(filterOptions:FilterOptions) => void)
    {
        this.onFilterOptionsChanged = onFilterOptionsChanged;
    }
    
    updateSearchField(searchField:string):void
    {
        this.filterOptions.s = searchField;
        this.updateSearchOptions();
    }
    
    updateSearchOptions():void
    {
        if(this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() =>
        {
            this.onFilterOptionsChanged(this.filterOptions);
        }, 500);
    }
    
    view():Children
    {
        return m(".field", [
            m('.control.is-expanded', m("input.input[type='text']", {
                // value: this.filterOptions.s,
                placeholder: 'Type to filter...',
                oninput: m.withAttr("value", this.updateSearchField.bind(this))
            }))
        ]);
    }
}