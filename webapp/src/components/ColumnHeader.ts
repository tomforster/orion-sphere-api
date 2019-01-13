export class ColumnHeader
{
    label:string;
    sortField?:string;
    
    constructor(label:string, sortField?:string)
    {
        this.label = label;
        this.sortField = sortField;
    }
}