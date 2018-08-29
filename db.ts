require("reflect-metadata");
import {ConnectionOptions, createConnection} from "typeorm";
import * as PostgressConnectionStringParser from 'pg-connection-string';

const connectionOptions = PostgressConnectionStringParser.parse(process.env.DATABASE_URL);


export const connectionPromise = createConnection(<ConnectionOptions>{
    type: "postgres",
    host: connectionOptions.host,
    port: connectionOptions.port || 5432,
    username: connectionOptions.user,
    password: connectionOptions.password,
    database: connectionOptions.database,
    entities: [
        "entity/**/*.ts"
    ],
    migrations: [
        "migration/**/*.ts"
    ],
    synchronize: true,
    schema: "orion_sphere",
    extra: {
        "ssl": true
    },
    cli: {
        migrationsDir: "migration"
    }
}).catch(e => {
    console.error(e);
    // return;
    throw e;
});