export class Page<T>
{
    content:T[];
    number:number;
    size:number;
    first:boolean;
    last:boolean;
    totalItems:number;
    totalPages:number;
    
    constructor(content:T[] = [], number:number = 0, size:number = 25, totalItems:number = 0)
    {
        this.content = content;
        this.number = number;
        this.totalItems = totalItems;
        this.totalPages = Math.ceil(totalItems/size);
        this.size = size;
        this.first = number === 0;
        this.last = number === this.totalPages - 1;
    }
}