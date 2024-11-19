import express, { json } from 'express';
import cors from 'cors';
const app = express();
import { gameStates, GameState } from './Gamestate.mjs';
import sessions from 'express-session';
import path, { dirname } from 'path';
import { renderFile } from 'pug';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { loadGames } from './Storage.mjs'
import { getStatistics, getStatisticsKeys } from './statistics.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, '/views'));
// console.log(renderFile(path.join(__dirname, '/views/mops.pug'), { games }));

app.use(json());
app.use(cors());
app.use(sessions({ secret: 'hemmelig', saveUninitialized: true, cookie: { maxAge: 1000 * 60 * 20 }, resave: false }));
app.use(express.static(__dirname + '/../Client'));
app.set('view engine', 'pug');
app.set("views", __dirname + "/views");

let indexCounter = 0;

app.get('/dice', async (request, response) => {
    let id = request.session.playerId;
    response.send({ dice: gameStates[id].dice, rollsLeft: 3 - gameStates[id].rollCount });
});
app.get('/gamestate', async (request, response) => {
    let id = request.session.playerId;
    let name = request.session.playerName;
    if (id == undefined) {
        request.session.playerId = indexCounter;
        indexCounter++;
        id = request.session.playerId;
        gameStates[id] = new GameState(name);
    }
    //Checker om gamet er færdig, og clearer id'et, så de kan starte et nyt game.
    if (gameStates[id].gameState().finished) {
        request.session.playerId = undefined;
    }
    response.send(gameStates[id].gameState());
});
app.post('/roll', async (request, response) => {
    let id = request.session.playerId;
    gameStates[id].rollDice();
    response.sendStatus(201);
});
app.post('/lockDice', async (request, response) => {
    let id = request.session.playerId;
    const { number } = request.body;
    gameStates[id].diceHoldChange(number);
    response.sendStatus(201);
});
app.post('/choosePoint', async (request, response) => {
    let id = request.session.playerId;
    // console.info('Client nr ' + id + " chose point")
    const { name } = request.body;
    gameStates[id].choosePoint(name);
    response.sendStatus(201);
});

app.get('/game', async (request, response) => {
    response.sendFile(path.resolve(__dirname + "\\..\\Client\\yatzy.html"))
})

app.post('/loadGame', async (request, response) => {
    const { name } = request.body;
    request.session.playerName = name;
    response.sendStatus(201);
});

app.get('/:playerName/Statistics', async (request, response) => {
    response.send(getStatistics(request.params["playerName"]));
});

app.get('/', async (request, response) => {
    response.render('mops', { games: leaderboardStatus(), statistics: getStatisticsKeys() });
});


function leaderboardStatus() {
    let games = [];
    // games.push({ 'name': "Thor", 'zeros': 12, 'score': 23 })
    // games.push({ 'name': "Bo", 'zeros': 2, 'score': 44 })
    // games.push({ 'name': "Carl", 'zeros': 1, 'score': 43 })
    // games.push({ 'name': "Thor", 'zeros': 6, 'score': 2 })
    try {
        for (const game of loadGames()) {
            games.push({
                'name': game.playerName,
                'zeros': Object.entries(game.results).filter(r => r[1].score == 0).length,
                'score': game.totalScore
            })
        }
    }
    catch (TypeError) {
        //savegames er tom
        console.log("Ingen save games, eller anden fejl.")
    }

    games.sort((d, b) => b.score - d.score)
    return games;
}


const portNr = 11111;
app.listen(portNr, () => {
    console.log(`Server running on port ${portNr}.`)
})