'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const fs = require('fs');
const jsdom = require('jsdom');

let page = 46;
let gameNumber = 811;


let CronJob = require('cron').CronJob;
let job = new CronJob('00 * * * * *', function() {

    if (page == 1) {
        let blankObj = {};
        requestAndParsePage(blankObj);

    } else {
        fs.readFile('games.json', function(error, data) {
            if (error) console.log(error);
            let masterObject = JSON.parse(data);

            requestAndParsePage(masterObject);

        });
    }
}, function() {}, true);


function requestAndParsePage(listObject) {


    request.get(`http://www.howlongtobeat.com/search_main.php?page=${page}`, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            jsdom.env(body, function(err, window) {

                if (err) {
                    console.log(`JSdom error: ${err}`);
                    return;
                }

                let games = window.document.getElementsByClassName('search_list_details');

                for (var game in games) {

                    listObject[gameNumber] = gameParser(games[game]);
                    gameNumber++;
                }

                fs.writeFileSync('games.json', JSON.stringify(listObject));
                console.log(`Wrote page ${page}`);
                page++;

            });

        }

    });
}


function gameParser(game) {
    let gameObject = {};
    gameObject.Title = game.getElementsByClassName('text_blue')[0].innerHTML;

    let details = game.getElementsByClassName('search_list_details_block')[0];
    let count = 0;

    while (details.getElementsByTagName('div')[count] != undefined) {

        let nameOfProperty = details.getElementsByTagName('div')[count + 1].innerHTML;
        gameObject[nameOfProperty] = lengthParser(details.getElementsByTagName('div')[count + 2].innerHTML);
        count += 3;
    }

    return gameObject;

    function lengthParser(str) {
        if (str == '--') {
            return str;
        }

        if (str.indexOf('Mins') != -1){
            return ((parseInt(str) / 60).toFixed(2));
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
