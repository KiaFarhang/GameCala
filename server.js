'use strict';
 
 const express = require('express');

 require('dotenv').config;

 let options = {
 	root: __dirname
 };

 app.use(express.static('dist'));

 app.get('/', function(request, response){
 	res.sendfile('dist/index.html', options);
 });

 app.listen(8080);