import {SortField} from "./SortField";

export interface Pageable
{
    sort:SortField
    page:number;
    size:number;
}