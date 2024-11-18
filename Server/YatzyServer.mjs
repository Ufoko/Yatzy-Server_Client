import express, { json } from 'express';
import cors from 'cors';
const app = express();
import { gameStates, GameState } from './Gamestate.mjs';
import sessions from 'express-session';
import path from 'path';
import { renderFile } from 'pug';
import { join } from 'path';
import { fileURLToPath } from 'url';

app.use(json());
app.use(cors());
app.use(sessions({ secret: 'hemmelig', saveUninitialized: true, cookie: { maxAge: 1000 * 60 * 20 }, resave: false }));
app.set('view engine', 'pug');
app.set("views", __dirname + "/views");


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let indexCounter = 0;

app.use(express.static(__dirname + '/../Client'));

app.get('/dice', async (request, response) => {
    let id = request.session.playerId;
    console.log(id)
    response.send({dice : gameStates[id].dice, rollsLeft : 3 - gameStates[id].rollCount});
});
app.get('/gamestate', async (request, response) => {
    // let id = request.session.id;
    let id = request.session.playerId;
    console.log(id)
    if (id == undefined) {
        request.session.playerId = indexCounter;
        indexCounter++;
        id = request.session.playerId;
        gameStates[id] = new GameState();
    }
    console.log(id)
    response.send(gameStates[id].gameState());
});
app.post('/roll', async (request, response) => {
    let id = request.session.playerId;
    console.info('Client nr ' +  id + " rolled")
    gameStates[id].rollDice();
    response.sendStatus(201);
});
app.post('/lockDice', async (request, response) => {
    let id = request.session.playerId;
    const { number } = request.body;
    gameStates[id].diceHoldChange(number)
    response.sendStatus(201);
});
app.post('/choosePoint', async (request, response) => {
    let id = request.session.playerId;
    console.info('Client nr ' +  id + " chose point")
    const { name } = request.body;
    gameStates[id].choosePoint(name);
    response.sendStatus(201);
});
app.post('/frontpage', async (request, response) => {
    
});
function loadFrontPage(){
    let games = [];

    games.push({'name': Thor, 'score': 23})
    games.push({'name': Bo, 'score': 44})
    games.push({'name': Carl, 'score': 43})
    games.push({'name': Thor, 'score': 2})


for (const game of getSaveGames) { 
   // games.push({'name': game.name, 'score': game.gamestate().totalScore})
}


console.log(renderFile(join(__dirname, '/mops.pug'), {games}));
}


const portNr = 11111;
app.listen(portNr, () => {
    console.log(`Server running on port ${portNr}.`)
})