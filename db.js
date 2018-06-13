const initOptions = {
    schema: 'orion_sphere',
    query: e => {
        console.log(e.query);
    }
};

const pgp = require('pg-promise')(initOptions);

const cn = require("./config/config.json").database;

module.exports = pgp(cn);