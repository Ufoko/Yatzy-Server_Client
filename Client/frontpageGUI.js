console.log("HEJS")

import { renderFile } from 'pug';
import { join } from 'path';
//import {getSaveGames } from "./clientservercommunicationyatzycom.js";
import express from 'express';

let app = express();

app.set('view engine', 'pug');
app.set("views", __dirname + "/views");

//loadFrontPage();

function loadFrontPage(){
    let games = [];

    games.push({'name': Thor, 'score': 23})
    games.push({'name': Bo, 'score': 44})
    games.push({'name': Carl, 'score': 43})
    games.push({'name': Thor, 'score': 2})


for (const game of getSaveGames) { 
    games.push({'name': game.name, 'score': game.gamestate().totalScore})
}


console.log(renderFile(join(__dirname, '/mops.pug'), {games}));
}