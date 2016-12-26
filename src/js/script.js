'use strict';

document.forms[0].addEventListener('submit', handleTimeInput);
let searchBox = document.getElementsByClassName('searchBox')[0];
searchBox.addEventListener('keyup', handleSearchInput);
document.getElementsByClassName('goToCompare')[0].addEventListener('click', handleGoToCompare);

let timePlayedPerWeek = null;

function Game(object) {
    for (var key in object) {
        if (object[key] != null) {
            this[key] = object[key];
        }
    }
}

function handleGoToCompare() {
    visibilityToggle(3);
}

function handleTimeInput(event) {
    event.preventDefault();
    let input = document.getElementsByClassName('timeBox')[0];
    timePlayedPerWeek = parseInt(input.value);
    visibilityToggle(2);
}

function handleSearchInput() {
    if (searchBox.value.length == 1) return;

    wipeSearchResults();

    searchBox.removeEventListener('keyup', handleSearchInput);

    let queryTheTitle = queryOnTitle(searchBox.value);
    queryTheTitle
        .then(parseQueryResults, console.error)
        .then(displayGamesInSearch, console.error);
    setTimeout(function() {
        searchBox.addEventListener('keyup', handleSearchInput);
    }, 200);
}

function queryOnTitle(string) {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('GET', '/query', true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.setRequestHeader('QUERY', `${string}`);

        request.addEventListener("load", function() {
            if (JSON.parse(request.responseText).length == 0) {
                displaySearchError();
                return reject();
            }
            return resolve(JSON.parse(request.responseText));
        });
        request.send();
    });
}

function parseQueryResults(array) {
    return new Promise((resolve, reject) => {
        let arrayOfGameObjects = [];
        if (array.length > 10) {
            for (let i = 0; i < 10; i++) {
                let game = new Game(array[i]);
                arrayOfGameObjects.push(game);
            }
        } else {
            for (let i = 0; i < array.length; i++) {
                let game = new Game(array[i]);
                arrayOfGameObjects.push(game);
            }
        }
        return resolve(arrayOfGameObjects);
    });
}

function displayGamesInSearch(arrayOfGames) {
    let list = document.getElementsByClassName('resultsList')[0];
    for (let i = 0; i < arrayOfGames.length; i++) {
        let title = arrayOfGames[i].Title;
        let li = document.createElement('li');
        li.innerText = title;
        let clickFunction = constructGameEventListener(arrayOfGames[i]);
        li.addEventListener('click', clickFunction);
        list.appendChild(li);
    }
}

function constructGameEventListener(game) {
    let func = function() {
        appendGameToCompareList(game);
    }
    return func;
}

function wipeSearchResults() {
    let list = document.getElementsByClassName('resultsList')[0];
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
}

function displaySearchError() {
    let list = document.getElementsByClassName('resultsList')[0];
    let li = document.createElement('li');
    li.classList.add('error');
    li.innerText = 'No search results found.';
    list.appendChild(li);
}

function appendGameToCompareList(game) {
    let div = document.createElement('div');
    div.classList.add('compareGame');

    let title = game.Title;
    let titleGraf = document.createElement('p');
    titleGraf.innerText = title;
    div.appendChild(titleGraf);

    for (var key in game) {
        if (key != 'Title') {
            let infoString = constructString(key, game[key]);
            let p = document.createElement('p');
            p.innerText = infoString;
            div.appendChild(p);
        }
    }
    document.getElementsByClassName('compare')[0].appendChild(div);
}

function constructString(property, value) {
    let length = calculateWeeksNeeded(parseInt(value));
    return `${length} weeks for ${property}`;
}

function calculateWeeksNeeded(length) {
    return length / timePlayedPerWeek;
}

function visibilityToggle(sectionOn) {
    let toFadeIn = document.getElementsByTagName('section')[sectionOn - 1];
    let toFadeOut = getCurrentVisibleSection();

    changeVisibility(toFadeOut);
    changeVisibility(toFadeIn);
}

function changeVisibility(element) {
    element.classList.toggle('hidden');
    element.classList.toggle('visible');
}

function getCurrentVisibleSection() {
    let sections = document.getElementsByTagName('section');
    for (let i = 0; i < sections.length; i++) {
        if (sections[i].classList.contains('visible')) return sections[i];
    }
}













// function handleSearchInput() {
//     if (searchBox.value.length == 1) return;

//     wipeSearchResults();

//     searchBox.removeEventListener('keyup', handleSearchInput);
//     queryOnTitle(searchBox.value);
//     setTimeout(function() {
//         searchBox.addEventListener('keyup', handleSearchInput);
//     }, 500);
// }


// function queryOnTitle(string) {
//     let request = new XMLHttpRequest();
//     request.open('GET', '/query', true);
//     request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//     request.setRequestHeader('QUERY', `${string}`);

//     request.addEventListener("load", function() {
//         if (JSON.parse(request.responseText).length == 0) {
//             displaySearchError();
//             return;
//         }
//         parseQueryResults(JSON.parse(request.responseText));
//     });

//     request.send();
// }

// function parseQueryResults(array) {
//     for (let i = 0; i < 10; i++) {
//         let game = new Game(array[i]);
//         displayGameInSearch(game);
//     }
// }
