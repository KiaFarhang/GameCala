// TODO:

// -Better feedback when you click a game and add it to the list
// -Fix ampersands in game titles (need to do in DB)
// -Remove accent marks in titles in database
// -Recalculate times when new weekly hour submitted (store current list in global object)
// -Delete games from list on third-pane click
// -Does it make sense to include "Combined" in results?

'use strict';

let timePlayedPerWeek = null;
let searchBox = document.getElementsByClassName('searchBox')[0];

addEventListeners();

function addEventListeners() {
    document.forms[0].addEventListener('submit', handleTimeInput);
    searchBox.addEventListener('keyup', handleSearchInput);
    document.getElementsByClassName('goToCompare')[0].addEventListener('click', handleGoToCompare);

    let headerTabs = document.getElementsByTagName('header')[0].getElementsByTagName('div');
    for (let i = 0; i < headerTabs.length; i++) {
        headerTabs[i].addEventListener('click', function() {
            transitionToSection(i + 1);
        });
    }

    document.getElementsByClassName('clearComparePane')[0].addEventListener('click', clearComparePane);
}

function Game(object) {
    for (var key in object) {
        if (object[key] != null) {
            this[key] = object[key];
        }
    }
}

function handleGoToCompare() {
    makeTabVisible(3);
    transitionToSection(3);
}

function handleTimeInput(event) {
    event.preventDefault();
    let input = parseInt(document.getElementsByClassName('timeBox')[0].value);

    if (isNaN(input)) {
        throwTimePlayedError();
    } else {
        document.forms[0].classList.remove('error');
        timePlayedPerWeek = input;
        makeTabVisible(2);
        transitionToSection(2);
    }
}

function throwTimePlayedError() {
    let form = document.forms[0];
    form.classList.add('error');
    form.getElementsByClassName('timeBox')[0].value = '';
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

function isAlreadyInResults(title) {
    let resultsTitles = document.getElementsByClassName('resultsTitle');
    if (resultsTitles.length == 0) {
        return false;
    }
    for (let i = 0; i < resultsTitles.length; i++) {
        if (title == resultsTitles[i].textContent) {
            return true;
        }
    }
    return false;
}

function showGameAsAdded(li) {
    if (li.classList.contains('added') != true) {
        li.classList.add('added');
    }
}

function constructGameEventListener(game) {
    let func = function() {
        let title = game.Title;
        if (isAlreadyInResults(title) == false) {
            showGameAsAdded(event.target);
            appendGameToCompareList(game);
        }
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
    titleGraf.classList.add('resultsTitle');
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
    let weeks = calculateWeeksNeeded(parseInt(value));
    let futureDate = parseDateIntoString(addDaysToDate(weeks * 7));
    return `About ${weeks} weeks for ${property} (Finish around ${futureDate})`;
}

function calculateWeeksNeeded(length) {
    return Math.round(length / timePlayedPerWeek);
}

function addDaysToDate(days) {
    let result = new Date();
    result.setDate(result.getDate() + days);
    return result;
}

function parseDateIntoString(date) {
    let months = ["January", "February", "March",
        "April", "May", "June",
        "July", "August", "September",
        "October", "November", "December"
    ]

    let month = months[date.getMonth()];
    let day = date.getDate();
    let year = date.getFullYear();
    return `${month} ${day}, ${year}`;
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

function transitionToSection(section) {
    visibilityToggle(section);
}

function makeTabVisible(tab) {
    let tabs = document.getElementsByTagName('header')[0].getElementsByTagName('div');
    changeVisibility(tabs[tab - 1]);
}


function clearComparePane() {
    let comparePane = document.getElementsByClassName('compare')[0];
    while (comparePane.firstChild) {
        comparePane.removeChild(comparePane.firstChild);
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
