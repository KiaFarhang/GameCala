// TODO:

// -Split results strings up to say week/weeks, add styling to properties 
// -Make sure header is always on top (z-index?) Or remove fixed positioning
// -Keep "Added" persistent even after searching for something else
// -Tell user when values recalcultaed (where to send them on mobile?)


'use strict';

let currentGameResults = [];

let timePlayedPerDay = null;
var xStart = null;
var yStart = null;
let searchBox = document.getElementsByClassName('searchBox')[0];

addEventListeners();
document.getElementsByClassName('timeBox')[0].focus();

function addEventListeners() {
    document.addEventListener('touchstart', handleTouchStart, supportsPassive ? { passive: true } : false);
    document.addEventListener('touchend', handleTouchMove, supportsPassive ? { passive: true } : false);
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
    document.getElementsByClassName('clearComparePane')[0].addEventListener('click', deselectWholeSearchList);
    document.getElementsByClassName('clearComparePane')[0].addEventListener('click', clearGlobalGameArray);
}

function Game(object) {
    for (var key in object) {
        if (object[key] != null) {
            this[key] = object[key];
        }
    }
}

function handleGoToCompare() {
    if (isCompareListEmpty() == true) {
        document.getElementsByClassName('compareError')[0].textContent = 'Select games to compare';
    } else {
        document.getElementsByClassName('compareError')[0].textContent = '';
        makeTabVisible(3);
        transitionToSection(3);
    }
}

function handleTimeInput(event) {
    event.preventDefault();
    // let input = parseInt(document.getElementsByClassName('timeBox')[0].value);
    let input = document.getElementsByClassName('timeBox')[0].value;

    if (isNaN(input) || input > 24) {
        throwTimePlayedError();
        return;
    }


    document.forms[0].classList.remove('error');
    if (timePlayedPerDay == null) {
        timePlayedPerDay = input;
        makeTabVisible(2);
        transitionToSection(2);
        document.getElementsByClassName('searchBox')[0].focus();
    } else {
        timePlayedPerDay = input;
        clearComparePane();
        for (let i = 0; i < currentGameResults.length; i++) {
            appendGameToCompareList(currentGameResults[i]);
        }
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
        let request = ajax('GET', '/query');
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
        li.textContent = title;
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

function constructGameEventListener(game) {
    let func = function() {
        event.target.classList.toggle('added');
        let title = game.Title;
        if (isAlreadyInResults(title) == false) {
            appendGameToCompareList(game);
        } else {
            let gameToDelete = grabGameByTitle(title, 'results');
            deleteElement(gameToDelete);
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
    li.textContent = 'No search results found.';
    list.appendChild(li);
}

function appendGameToCompareList(game) {

    if (isAlreadyInGlobalArray(game) == false) {
        currentGameResults.push(game);
    }

    let div = document.createElement('div');
    div.classList.add('compareGame');

    let x = document.createElement('div');
    x.classList.add('deleteButton');
    x.innerText = 'X';
    x.addEventListener('click', deleteGameFromCompareList);
    div.appendChild(x);

    let title = game.Title;
    let titleGraf = document.createElement('p');
    titleGraf.innerText = title;
    titleGraf.classList.add('resultsTitle');
    div.appendChild(titleGraf);

    let arrayOfStrings = createArrayOfInfoStrings(game);
    appendArrayContentsToElement(arrayOfStrings, div);

    if (div.getElementsByTagName('p').length == 1) {
        let noInfo = document.createElement('p');
        noInfo.textContent = 'No info in database';
        div.appendChild(noInfo);
    }
    document.getElementsByClassName('compare')[0].appendChild(div);
}

function createArrayOfInfoStrings(game) {
    let array = [];
    for (var key in game) {
        if (key != 'Title' && key != 'Combined') {
            let infoString = constructString(key, game[key]);
            let p = document.createElement('p');
            p.textContent = infoString;
            array.push(p);
        }
    }
    return array;
}

function appendArrayContentsToElement(array, element) {
    for (let i = 0; i < array.length; i++) {
        element.appendChild(array[i]);
    }
}

function constructString(property, value) {
    let days = Math.round(value / timePlayedPerDay);
    let futureDate = parseDateIntoString(addDaysToDate(days));
    if (days == 0) {
        return `${property}: Finish today`;
    }
    if (days == 1) {
        return `${property}: ${days} day (${futureDate})`;
    }
    return `${property}: ${days} days (${futureDate})`;
}

// function calculateWeeksNeeded(length) {
//     return Math.round(length / timePlayedPerDay);
// }

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
    setCurrentHeader(section - 1);
}

function setCurrentHeader(newHeader) {
    document.getElementsByTagName('header')[0].getElementsByClassName('current')[0].classList.remove('current');
    document.getElementsByTagName('header')[0].getElementsByTagName('div')[newHeader].classList.add('current');
}

function makeTabVisible(tab) {
    let tabs = document.getElementsByTagName('header')[0].getElementsByTagName('div');
    if (tabs[tab - 1].classList.contains('hidden')) {
        changeVisibility(tabs[tab - 1]);
    }

}

function clearComparePane() {
    let comparePane = document.getElementsByClassName('compare')[0];
    while (comparePane.firstChild) {
        comparePane.removeChild(comparePane.firstChild);
    }

}

function deselectWholeSearchList() {
    let list = document.getElementsByClassName('resultsList')[0].getElementsByTagName('li');
    for (let i = 0; i < list.length; i++) {
        if (list[i].classList.contains('added')) {
            list[i].classList.remove('added');
        }
    }
}

function deleteGameFromCompareList(event) {
    let game = event.target.parentElement;
    let gameTitle = game.getElementsByClassName('resultsTitle')[0].textContent;
    let gameInSearch = grabGameByTitle(gameTitle, 'search');
    if (gameInSearch != null) {
        gameInSearch.classList.remove('added');
    }
    game.classList.add('deleted');
    setTimeout(function() {
        deleteElement(game);
    }, 500);
    deleteGameFromCurrentArray(gameTitle);
}

function isCompareListEmpty() {
    if (document.getElementsByClassName('compareGame').length == 0) {
        return true;
    }
    return false;
}

function grabGameByTitle(title, location) {

    if (location == 'results') {
        let resultsTitles = document.getElementsByClassName('resultsTitle');
        for (let i = 0; i < resultsTitles.length; i++) {
            if (title == resultsTitles[i].textContent) {
                return resultsTitles[i].parentElement;
            }
        }
    } else if (location == 'search') {
        let searchTitles = document.getElementsByClassName('resultsList')[0].getElementsByTagName('li');
        for (let i = 0; i < searchTitles.length; i++) {
            if (title == searchTitles[i].textContent) {
                return searchTitles[i];
            }
        }
        return null;
    }
}

function deleteGameFromCurrentArray(title) {
    for (let i = 0; i < currentGameResults.length; i++) {
        if (currentGameResults[i].Title == title) {
            currentGameResults.splice(i, 1);
        }
    }
}

function clearGlobalGameArray() {
    currentGameResults = [];
}

function isAlreadyInGlobalArray(game) {
    for (let i = 0; i < currentGameResults.length; i++) {
        if (game == currentGameResults[i]) {
            return true;
        }
    }
    return false;
}

function handleTouchStart(event) {
    xStart = event.touches[0].clientX;
    yStart = event.touches[0].clientY;
}

function handleTouchMove(event) {
    if (!xStart || !yStart) return;

    var xEnd = event.changedTouches[0].clientX;
    var yEnd = event.changedTouches[0].clientY;

    var xTraveled = xEnd - xStart;
    var yTraveled = yEnd - yStart;

    if (Math.abs(yTraveled) > 30) return;
    if (Math.abs(xTraveled) < 40) return;

    let currentTab = getCurrentHeaderTab();

    if (xTraveled > 0) {
        let targetTab = currentTab + 2;
        if (targetTab < 4 && isSectionAccessibleYet(targetTab) == true) {
            transitionToSection(targetTab);
            makeTabVisible(targetTab);
        }
    } else {
        let targetTab = currentTab - 1;
        if (targetTab > -1) {
            transitionToSection(targetTab +1);
        }
    }

    xEnd = null;
    yEnd = null;
}

function isSectionAccessibleYet(section) {
    let headerTabs = document.getElementsByTagName('header')[0].getElementsByTagName('div');
    if (headerTabs[section - 1].classList.contains('hidden')) {
        return false;
    }
    return true;
}

function getCurrentHeaderTab() {
    let headerTabs = document.getElementsByTagName('header')[0].getElementsByTagName('div');
    for (let i = 0; i < headerTabs.length; i++) {
        if (headerTabs[i].classList.contains('current')) {
            return i;
        }
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
