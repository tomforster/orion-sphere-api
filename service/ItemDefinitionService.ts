import {ItemDefinition} from "../entity/ItemDefinition";
import {Service} from "./Service";
import {validate} from "class-validator";

export class ItemDefinitionService extends Service<ItemDefinition>
{
    entityClass:any = ItemDefinition;
    
    create(params:ItemDefinition):Promise<ItemDefinition>
    {
        const entity = new ItemDefinition(undefined, params.itemType, params.name);
        if(!validate(entity)) throw new Error("Invalid Argument");
        return this.getRepository().save(entity);
    }
    
    update(params:ItemDefinition):Promise<ItemDefinition>
    {
        const entity = new ItemDefinition(undefined, params.itemType, params.name);
        if(!validate(entity)) throw new Error("Invalid Argument");
        return this.getRepository().save(entity);
    }
}