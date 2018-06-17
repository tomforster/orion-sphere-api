require("reflect-metadata");
import {createConnection} from "typeorm";

export const connectionPromise = createConnection().catch(e => {
    console.error(e);
    throw e;
});