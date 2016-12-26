'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const query = require('./db_query.js');

// var pg = require('pg');

require('dotenv').config();

// let pgConfig = {
//     user: process.env.DB_USER,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASS,
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     max: 10,
//     idleTimeoutMillis: 30000
// };

// let pool = new pg.Pool(pgConfig);

var app = express();

let options = {
    root: __dirname
};

let jsonParser = bodyParser.json();
let urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static('dist'));


app.get('/', function(request, response) {
    res.sendfile('dist/index.html', options);
});

app.get('/query', urlencodedParser, function(request, response) {
    let gameQuery = request.headers.query;
    let promise = query.queryLikeTitle(gameQuery);
    promise.then(sendJSON, console.error);

    function sendJSON(data) {
        response.send(JSON.stringify(data));
    }
});

app.listen(8080);
