import { chanceScore, fourOfAKindScore, fullHouseScore, largeStraightScore, onePairScore, smallStraightScore, threeOfAKindScore, twoPairScore, upperSectionScore, yatzyScore } from "./YatzyResultCalculators.mjs"


export let gameStates = [];

export class GameState {
    constructor(playerName) {
        this.name = playerName;
        this.turnCounter = 0;
        this.finished = false;
        this.rollCount = 0;

        //Terninger
        this.dice = [];
        for (let index = 0; index < 5; index++) {
            this.dice[index] = new die()
        }

        //Resultlisten
        this.results = {};
        for (let index = 1; index <= 6; index++) {
            this.results[index + '-s'] = new resultLine(index + "-s", upperSectionScore(index, this.dice));
        }
        this.results['onePair'] = new resultLine('onePair', onePairScore(this.dice));
        this.results['twoPair'] = new resultLine('twoPair', twoPairScore(this.dice));
        this.results['threeOfAKind'] = new resultLine('threeOfAKinde', threeOfAKindScore(this.dice));
        this.results['fourOfAkind'] = new resultLine('fourOfAkind', fourOfAKindScore(this.dice));
        this.results['fullHouseScore'] = new resultLine('fullHouseScore', fullHouseScore(this.dice));
        this.results['smallStraightScore'] = new resultLine('smallStraightScore', smallStraightScore(this.dice));
        this.results['largeStraightScore'] = new resultLine('largeStraightScore', largeStraightScore(this.dice));
        this.results['chanceScore'] = new resultLine('chanceScore', chanceScore(this.dice));
        this.results['yatzyScore'] = new resultLine('yatzyScore', yatzyScore(this.dice));
    }

    /**
     * 
     * @returns up to date gameState object
     */
    gameState() {
        let totalScore = 0;
        for (const resultKey in this.results) {
            let resultLine = this.results[resultKey]
            if (resultLine.used) {
                totalScore += resultLine.score;
            } else {
                resultLine.score = resultLine.calculater();
            }
        }

        if (this.turnCounter == 15) {
            this.finished = true;
        }
        return { turnNr: this.turnCounter, result: { list: this.results, totalScore: totalScore }, sumAndBonus: { sum: this.sum(), bonus: this.bonus() }, finished: this.finished };
    }

    newturn() {
        this.rollCount = 0;
        this.turnCounter++;
        this.rollDice();
    }

    rollDice() {
        if (this.rollCount < 3) {
            this.rollCount++;
            for (const die of this.dice) {
                die.roll();
            }
        }
    }

    diceHoldChange(index) {
        this.dice[index].hold = !this.dice[index].hold
    }

    choosePoint(name) {
        this.newturn();
        this.results[name].used = true;
    }

    bonus() {
        let singlesScore = this.sum();
        return singlesScore >= 63 ? 50 : 0
    }

    sum() {
        let singlesScore = 0
        for (let index = 1; index <= 6; index++) {
            singlesScore += (this.results[index + '-s'].used) ? this.results[index + '-s'].score : 0;
        }
        return singlesScore;
    }
}

class resultLine {
    constructor(name, calculator) {
        this.name = name;
        this.used = false;
        this.score = 0;
        this.calculater = calculator;
    }
}

class die {
    constructor() {
        this.hold = false;
        this.value = this.roll();
    }

    roll() {
        if (this.hold != true) {
            return this.value = Math.floor(Math.random() * 6 + 1)
        } else return this.value;
    }
}