export class Page<T>
{
    content:T[];
    number:number;
    size:number;
    first:boolean;
    last:boolean;
    totalItems:number;
    totalPages:number;
    
    constructor(content:T[], number:number, size:number, totalItems:number)
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