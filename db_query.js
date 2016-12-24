var pg = require('pg');
require('dotenv').config();
let pgConfig = {
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    max: 10,
    idleTimeoutMillis: 30000
};

let pool = new pg.Pool(pgConfig);


exports.queryLikeTitle = function(string) {
     return pool.connect(function(error, client, release) {
        if (error) throw error;
        return client.query(`SELECT * FROM games WHERE "Title" LIKE $$%${string}%$$`, function(error, result) {
            if (error) console.log(`Error querying DB: ${error}`);
            release();
            return result.rows;
        });
    });
}
