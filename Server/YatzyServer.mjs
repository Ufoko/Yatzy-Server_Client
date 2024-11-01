import express, { request, response, json } from 'express';
import cors from 'cors';
import { gameStates } from './Gamestate.mjs';


const app = express();
app.use(json());
app.use(cors());

app.get('/dice', async (request, response) => {
    let id = request.session.id;
    response.send(gameStates[id].dice);
});
app.get('/gamestate', async (request, response) => {
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

const portNr = 69420;
app.listen(portNr);
console.log(`Lytter på port ${portNr} ...`);