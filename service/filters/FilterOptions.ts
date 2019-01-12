/**
 * @author Tom Forster <tom.forster@mpec.co.uk>
 *         Date: 03/09/2018
 */

export interface FilterOptions
{
    s?:string;
    sort?:{field:string, direction:"ASC"|"DESC"}
    page:number;
    size:number;
}