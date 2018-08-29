require("reflect-metadata");
import {createConnection} from "typeorm";

export const connectionPromise = createConnection().catch(e => {
    console.error(e);
    return;
    throw e;
});