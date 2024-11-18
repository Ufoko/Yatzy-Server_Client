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

let games = [];

games.push({ 'name': "Thor", 'score': 23 })
games.push({ 'name': "Bo", 'score': 44 })
games.push({ 'name': "Carl", 'score': 43 })
games.push({ 'name': "Thor", 'score': 2 })
// console.log(renderFile(join(__dirname, '/mops.pug'), {games}))


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, '/views'));
console.log(renderFile(path.join(__dirname, '/views/mops.pug'), { games }));

app.use(json());
app.use(cors());
app.use(sessions({ secret: 'hemmelig', saveUninitialized: true, cookie: { maxAge: 1000 * 60 * 20 }, resave: false }));
app.use(express.static(__dirname + '/../Client'));
app.set('view engine', 'pug');
app.set("views", __dirname + "/views");



let indexCounter = 0;



app.get('/dice', async (request, response) => {
    let id = request.session.playerId;
    console.log(id)
    response.send({ dice: gameStates[id].dice, rollsLeft: 3 - gameStates[id].rollCount });
});
app.get('/gamestate', async (request, response) => {
    // let id = request.session.id;
    let id = request.session.playerId;
    let name = request.session.playerName;
    console.log(name);
    console.log(id)
    if (id == undefined) {
        request.session.playerId = indexCounter;
        indexCounter++;
        id = request.session.playerId;
        gameStates[id] = new GameState(name);
    }
    console.log(id)
    response.send(gameStates[id].gameState());
});
app.post('/roll', async (request, response) => {
    let id = request.session.playerId;
    console.info('Client nr ' + id + " rolled")
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
    console.info('Client nr ' + id + " chose point")
    const { name } = request.body;
    gameStates[id].choosePoint(name);
    response.sendStatus(201);
});

app.get('/game', async (request, response) =>{
    console.log(__dirname + '\\..\\Client\\yatzy.html')
    response.sendFile(path.resolve( __dirname + "\\..\\Client\\yatzy.html"))
})

app.post('/loadGame', async (request, response) => {
    const { name } = request.body;
    request.session.playerName = name;
    response.sendStatus(201);
});

app.get('/', async (request, response) => {
    response.render('mops', { games: games });
});


function createFrontPage() {
    let games = [];

    games.push({ 'name': "Thor", 'score': 23 })
    games.push({ 'name': "Bo", 'score': 44 })
    games.push({ 'name': "Carl", 'score': 43 })
    games.push({ 'name': "Thor", 'score': 2 })

    try {
        for (const game of loadGames()) {
            games.push({ 'name': game.name, 'score': game.gamestate().totalScore })
        }
    }
    catch (TypeError) {
        //savegames er tom
        console.log("Skyd dig selv")
    }


    return games;
}


const portNr = 11111;
app.listen(portNr, () => {
    console.log(`Server running on port ${portNr}.`)
})