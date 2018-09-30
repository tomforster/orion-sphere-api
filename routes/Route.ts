export interface Route
{
    path:string;
    method:string;
    isPaged?: boolean;
    pagedById?: boolean;
    action: Function;
}