import {Route} from "./Route";
import {ItemTypeRoutes} from "./ItemTypeRoutes";
import {ItemRoutes} from "./ItemRoutes";
import {ModRoutes} from "./ModRoutes";
import {ItemModelRoutes} from "./ItemModelRoutes";
import {AbilityRoutes} from "./AbilityRoutes";

export const Routes:Route[] = []
    .concat(...ItemTypeRoutes,
        ...ItemRoutes,
        ...ModRoutes,
        ...ItemModelRoutes,
        ...AbilityRoutes);