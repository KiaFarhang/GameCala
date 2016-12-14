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
            let games = window.document.getElementsByClassName('search_list_details');
            let obj = {};

            for (var game in games) {

                let thisGame = gameParser(games[game]);

                obj[thisGame.title] = thisGame;
            }

            fs.writeFile('test.json', JSON.stringify(obj), function(err) {
                    if (err) {
                        console.log(err);
                    }
                });

        });

    }

});

function gameParser(game) {
    let obj = {};
    obj.title = game.getElementsByClassName('text_blue')[0].innerHTML;
    if (game.getElementsByClassName('search_list_tidbit')[0].innerHTML == 'Co-Op') {
        obj['co-op'] = lengthParser(game.getElementsByClassName('search_list_details_block')[0].getElementsByTagName('div')[0].getElementsByTagName('div')[1].innerHTML);
        obj.vs = lengthParser(game.getElementsByClassName('search_list_details_block')[0].getElementsByTagName('div')[3].getElementsByTagName('div')[1].innerHTML);
        return obj;
    }
    obj.main = lengthParser(game.getElementsByClassName('search_list_details_block')[0].getElementsByTagName('div')[0].getElementsByTagName('div')[1].innerHTML);
    obj.extra = lengthParser(game.getElementsByClassName('search_list_details_block')[0].getElementsByTagName('div')[3].getElementsByTagName('div')[1].innerHTML);
    obj.completionist = lengthParser(game.getElementsByClassName('search_list_details_block')[0].getElementsByTagName('div')[6].getElementsByTagName('div')[1].innerHTML);
    obj.combined = lengthParser(game.getElementsByClassName('search_list_details_block')[0].getElementsByTagName('div')[9].getElementsByTagName('div')[1].innerHTML);

    return obj;

    function lengthParser(str) {
        if (str == '--') {
            return str;
        }

        if (parseInt(str) != NaN) {
            if (str.indexOf('½') != -1) {
                return (parseInt(str) + .5);
            } else {
                return parseInt(str);
            }
        }
    }
}
