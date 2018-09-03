/**
 * @author Tom Forster <tom.forster@mpec.co.uk>
 *         Date: 03/09/2018
 */
import {ItemModelFilterOptions} from "./ItemModelFilterOptions";
import {FilterOptions} from "./FilterOptions";

export interface ItemFilterOptions extends FilterOptions
{
    itemModel:ItemModelFilterOptions;
    modIds:string[];
}