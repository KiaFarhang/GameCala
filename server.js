'use strict';

const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');

const query = require('./db_query.js');


require('dotenv').config();

var app = express();

let options = {
    root: __dirname
};
app.use(favicon(__dirname + '/dist/img/favicon.ico'));

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
