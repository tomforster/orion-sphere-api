import {Ability} from "../entity/Ability";
import {Service} from "./Service";

export class AbilityService extends Service<Ability>
{
    entityClass:any = Ability;
}