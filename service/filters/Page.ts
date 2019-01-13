import {SortField} from "./SortField";

export class Page<T>
{
    content:T[];
    number:number;
    size:number;
    first:boolean;
    last:boolean;
    totalItems:number;
    totalPages:number;
    sort:SortField;
    
    constructor(content:T[] = [], number:number = 0, size:number = 25, totalItems:number = 0, sort:SortField = {field: "id", direction: "ASC"})
    {
        this.content = content;
        this.number = number;
        this.totalItems = totalItems;
        this.totalPages = Math.ceil(totalItems/size);
        if(number >= this.totalPages) this.number = 0;
        this.size = size;
        this.first = this.number === 0;
        this.last = this.totalPages === 0 || this.number === this.totalPages - 1;
        this.sort = sort;
    }
}