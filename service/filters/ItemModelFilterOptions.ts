/**
 * @author Tom Forster <tom.forster@mpec.co.uk>
 *         Date: 03/09/2018
 */
import {FilterOptions} from "./FilterOptions";

export interface ItemModelFilterOptions extends FilterOptions
{
    name:string;
    itemTypeId?:number;
}