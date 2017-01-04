#Compare Video Games by Length#

I've loved video games ever since my parents bought 4-year-old Kia an NES at a garage sale. But I barely have any time to game. When choosing between games to play, I need to know roughly how long it would take to finish each one. [How Long to Beat](http://howlongtobeat.com/) has an awesome game-length database, but no way to quickly compare multiple games at a time. So I built [GameCala](https://gamecala.com) to do it.

##Step 1: Scraping HLTB##

How Long to Beat users have submitted entries for more than 20,000 video games. Many games have multiple average times depending on the type of player you are - so it might take you 13 hours to finish Metal Gear Solid 2 if you just do the main story, but 20 if you're a completionist. MGS2 is the best in the series, by the way.

I needed access to this mountain of data for GameCala, but How Long to Beat has no API. They DO have a PHP endpoint for querying their database, which returns HTML pages with about a dozen games each. I used jsDOM and wrote a few parsing functions to request search pages one at a time, from 1 to about 1300. My Node script (scraper.js) synchronously "checks out" a JSON list of games (games.json), parses the How Long to Beat HTML and creates objects for each game. Those games get attached to an object representing the entire list of games, which I then turn back into JSON and "check back in" to the filesystem.

##Step 2: What is SQL, Exactly?##

So after a few days I had all the game-length data anyone could ever want. I needed to build my first database to store it all. I considered MongoDB because all my data was in JSON format. But I heard horror stories about how Mongo can set your data structure in stone, making later tweaks to the database difficult. I decided to try my hand at SQL and chose PostgreSQL for the job.

The script database_builder.js retrieves games from my JSON file one at a time, constructing a SQL query to add them to my database of games. Every game will be added to the database with a title. Length information is split into separate columns - so not every game will have a "Completionist" entry, for example, only the ones where How Long to Beat had that data.

##Step 3: Oh Yeah, Actually Building The App##

GameCala's front end is pretty simple. It's a one-page web application that asks the user how long they game per day. Then the user searches my database through games by querying an API endpoint I set up with Express - you send me a string, my server pings the database for games including that string and sends you back a list. Users build a list of games to compare and, after just a few seconds total, they're able to see how many hours the selected games will take to beat. The app also provides estimated finish dates for each game and type of play (i.e. you might finish it next Tuesday if you mainline the story, or the following Saturday if you go for 100%).

##Step 4: Fun Extras##

This is a project of firsts. In addition to my first database, this is the first project I've built on my own virtual private server. Shout-out to Digital Ocean, which has tutorials so simple my mom could probably get an SSL cert. Which reminds me, this is also my first website with an SSL cert, courtesy of DO and LetsEncrypt.

Finally, I set up a [progressive web app](https://developers.google.com/web/progressive-web-apps/) manifest (manifest.json in the dist/ directory) so mobile users can add GameCala to their home screen like an app. It's freakin' neat!