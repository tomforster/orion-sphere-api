import m, {Children, ClassComponent} from "mithril";
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
    
    updateSearchField(e:Event):void
    {
        if(e.target && e.target instanceof HTMLInputElement)
        {
            this.filterOptions.s = e.target.value;
            this.updateSearchOptions();
        }
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
                oninput: this.updateSearchField.bind(this)
            }))
        ]);
    }
}