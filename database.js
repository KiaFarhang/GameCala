'use strict';

const fs = require('fs');
var pg = require('pg');

const db_host = process.env.DB_HOST;
const db_name = process.env.DB_NAME;
const db_user = process.env.DB_USER;
const db_pass = process.env.DB_PASS;

let client = new pg.Client(db_host);
client.connect(function(error){
	if (error) throw error;
	console.log('Connected to database');
});
