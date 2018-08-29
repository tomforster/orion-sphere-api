import {Mod} from "../entity/Mod";
import {Service} from "./Service";

export class ModService extends Service<Mod>
{
    entityClass:any = Mod;
    
    create(entity:Mod):Promise<Mod>
    {
        return null;
    }
    
    update(entity:Mod):Promise<Mod>
    {
        return null;
    }
}