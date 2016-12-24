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

// pool.connect(function(error, client, done) {
//     if (error) throw error;
//     let numberOfGames = getGameListLength();
//     for (let i = 1; i <= numberOfGames; i++) {
//         let game = retrieveGameFromJSON(i);
//         let sqlString = generateSQLQueryForGame(game);
//         client.query(sqlString, function(err, result) {
//             if (err) throw err;
//             console.log(result);
//         });
//     }
// });


function retrieveGameFromJSON(index) {
    let gameList = JSON.parse(fs.readFileSync('games.json', 'utf8'));
    return gameList[index];
}

function getGameListLength() {
    let gameList = Object.keys(JSON.parse(fs.readFileSync('games.json', 'utf8')));
    return gameList.length;
}

function generateSQLQueryForGame(game) {
    let propertyKeys = [];
    let propertyValues = [];
    for (var key in game) {
        if (game[key] != '--' && game[key] != null) {
            propertyKeys.push(wrapStringInDoubleQuotes(key));
            if (typeof game[key] == 'number') {
                propertyValues.push(game[key]);
            } else {
                propertyValues.push(wrapStringInDollarQuotes(game[key]));
            }
        }
    }
    let query = `INSERT INTO games (${propertyKeys}) VALUES (${propertyValues}) ON CONFLICT ("Title") DO NOTHING`;
    return query;
    

    function wrapStringInDoubleQuotes(string) {
        return `\"` + string + `\"`;
    }

    function wrapStringInDollarQuotes(string) {
        return `$$` + string + `$$`;
    }


}
