import express, { json } from 'express';
import cors from 'cors';
const app = express();
import { gameStates, GameState } from './Gamestate.mjs';
import sessions from 'express-session';

app.use()
app.use(json());
//app.use(express.json());
app.use(cors());
// app.set('view engine', 'pug');

app.use(sessions({ secret: 'hemmelig', saveUninitialized: true, cookie: { maxAge: 1000 * 60 * 20 }, resave: false }));
// app.use(express.static(dirname + '/filer'));

app.get('/dice', async (request, response) => {
    let id = request.session.id;
    response.send(gameStates[id].dice);
});
app.get('/gamestate', async (request, response) => {
    if (request.session.id == undefined) {
        request.session.id = Math.floor(Math.random()*16);
        gameStates[id] = new GameState();
    }
    let id = request.session.id;
    response.send(gameStates[id].gameState());
});
app.post('/roll', async (request, response) => {
    let id = request.session.id;
    gameStates[id].rollDice();
    response.sendStatus(201);
});
app.post('/lockDice', async (request, response) => {
    let id = request.session.id;
    const { number } = request.body;
    gameStates[id].diceHoldChange(number)
    response.sendStatus(201);
});
app.post('/choosePoint', async (request, response) => {
    let id = request.session.id;
    const { name } = request.body;
    gameStates[id].choosePoint(name);
    response.sendStatus(201);
});

const portNr = 11111;
app.listen(portNr, () => {
    console.log(`Server running on port ${portNr}.`)
})