'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const fs = require('fs');
const jsdom = require('jsdom');

let options = {
    url: 'http://www.howlongtobeat.com/search_main.php?page=1',
    method: 'GET',
    headers: {
        'Content-Type': 'text/html'
    }
};

request.get(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        jsdom.env(body, function(err, window) {
            let doc = window.document;
 
            let games = doc.getElementsByClassName('search_list_details');
            // for (let i = 0; i < games.length; i++) {
            //     let title = games[i].firstChild;
            //     console.log(title.innerHTML);
            // }

            for (var game in games){
                let html = games[game].innerHTML;
                console.log(typeof html);
            }
        });

    }

});
