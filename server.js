'use strict';

const express = require('express');

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

app.use(express.static('dist'));

app.get('/', function(request, response) {
    res.sendfile('dist/index.html', options);
});

console.log(query.queryLikeTitle('Final Fantasy VII'));

app.listen(8080);
