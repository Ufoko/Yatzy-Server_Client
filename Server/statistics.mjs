import { loadGames } from "./Storage.mjs";

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
    return {"averagePoints" : averagePoints(name), "highestScore" : highScore(name)}
}

export function getStatisticsKeys() {
    return [new Statistic("Genemsnitlige Point", "averagePoints"), new Statistic("Højeste Score", "highestScore")]
}

class Statistic {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }
}