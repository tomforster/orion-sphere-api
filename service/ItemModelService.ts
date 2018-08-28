import {ItemModel} from "../entity/ItemModel";
import {Service} from "./Service";
import {validate} from "class-validator";

export class ItemModelService extends Service<ItemModel>
{
    entityClass:any = ItemModel;
    
    create(params:ItemModel):Promise<ItemModel>
    {
        const entity = new ItemModel(undefined, params.itemType, params.name);
        if(!validate(entity)) throw new Error("Invalid Argument");
        return this.getRepository().save(entity);
    }
    
    update(params:ItemModel):Promise<ItemModel>
    {
        const entity = new ItemModel(undefined, params.itemType, params.name);
        if(!validate(entity)) throw new Error("Invalid Argument");
        return this.getRepository().save(entity);
    }
}