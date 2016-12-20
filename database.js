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

pool.connect(function(error, client, done){
	if (error){
		return console.log(`Error fetching client from pool: ${error}`);
	}
	client.query(`CREATE TABLE games
	 ( Title 
	 	) `)
});
