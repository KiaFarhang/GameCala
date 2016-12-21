'use strict';

const fs = require('fs');
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

// pool.connect(function(error, client, done){
// 	if (error){
// 		return console.log(`Error fetching client from pool: ${error}`);
// 	}
// 	client.query('SELECT * FROM public.games', function(err, result){
// 		if (err) throw err;
// 		console.log(result.rows[0]);
// 		console.log(typeof result.rows[0]);
// 	});
// });

pool.connect(function(error, client, done) {
    if (error) throw error;
    let game = retrieveGameFromJSON(1);
    generateSQLQueryForGame(game);
    // client.query(`INSERT INTO games ("Title") VALUES ('${gameName}') ON CONFLICT ("Title") DO NOTHING`, function(err, result){
    // 	if (err) throw err;
    // 	console.log(result);
    // });
});


function retrieveGameFromJSON(index) {
    let gameList = JSON.parse(fs.readFileSync('games.json', 'utf8'));
    return gameList[index];
}

function generateSQLQueryForGame(game) {
    let columnString = ``;
    let valueString = ``;
    let propertyKeys = Object.keys(game);
    // for (var name in propertyKeys) {
    //     if (game[prop] != '--') {
    //         columnString += `"${game[prop]}", `;
    //     }
    // }
    // console.log(columnString);
    console.log(propertyKeys.join(', '));
    let query = `INSERT INTO games `;

}
