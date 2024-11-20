import { Statistic } from "./Gomponents.mjs";
import { loadGames } from "./Storage.mjs";

export let statistics = [
    new Statistic("Antal spil", "numberOfGames", numberOfGames),
    new Statistic("Højeste Score", "highestScore", highScore),
    new Statistic("Genemsnitlige Point", "averagePoints", averagePoints), 
    new Statistic("Laveste Antal Point", "lowestScore", lowestScore)
];

function lowestScore(name) {
    let gamestates = loadGames().filter(gamestate => gamestate.playerName == name);
    let lowestScore = gamestates.reduce((min, gamestate) => min = (gamestate.totalScore < min)? gamestate.totalScore : min, gamestates[0].totalScore);
    return lowestScore;
}

function numberOfGames(name) {
    let gamestates = loadGames().filter(gamestate => gamestate.playerName == name);
    let numberOfGames = gamestates.length;
    return numberOfGames;
}

function averagePoints(name) {
    let gamestates = loadGames().filter(gamestate => gamestate.playerName == name);
    let sum = gamestates.reduce((sum, gamestate) => sum + gamestate.totalScore, 0);
    let gameCount = gamestates.length;
    return sum / gameCount * 1.0;
}

function highScore(name) {
    let gamestates = loadGames().filter(gamestate => gamestate.playerName == name);
    let max = gamestates.reduce((max, gamestate) => max = (gamestate.totalScore > max)? gamestate.totalScore : max, 0)
    return max;
}

export function getStatistics(name) {
    return statistics.map(statistic => {return {"id" : statistic.id, "value" : statistic.calculator(name)}})
}

export function getStatisticsKeys() {
    return statistics.map(statistic => {return {"id" : statistic.id, "name" : statistic.name}});
}