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

exports.queryLikeTitle = function queryLikeTitle(string){
    return new Promise((resolve, reject) => {
        pool.connect(function(error, client, done){
            if (error) {
                return reject(error);
            }
            client.query(`SELECT 10 FROM games WHERE "Title" ILIKE $$%${string}%$$`, function(error, result){
                done();
                if (error){
                    return reject(error);
                }
                return resolve(result.rows);
            });
        });
    });
}