import { chanceScore, fourOfAKindScore, fullHouseScore, largeStraightScore, onePairScore, smallStraightScore, threeOfAKindScore, twoPairScore, upperSectionScore, yatzyScore } from "./YatzyResultCalculators.mjs"


export let gameStates = [];

class gameState {
    constructor(playerName) {
        this.name = playerName;
        this.turnCounter = 0;
        this.finished = false;

        //Terninger
        this.dice = [5];
        this.dice.forEach(index => dice[index] = new die());

        //Resultlisten
        this.results = {};
        for (let eyes = 1; index <= 6; index++) {
            results[eyes] = new resultLine(index + "-s", upperSectionScore(eyes));
        }
        results['onePair'] = new resultLine('onePair', onePairScore(this.dice));
        results['twoPair'] = new resultLine('twoPair', twoPairScore(this.dice));
        results['threeOfAKinde'] = new resultLine('threeOfAKinde', threeOfAKindScore(this.dice));
        results['fourOfAkind'] = new resultLine('fourOfAkind', fourOfAKindScore(this.dice));
        results['fullHouseScore'] = new resultLine('fullHouseScore', fullHouseScore(this.dice));
        results['smallStraightScore'] = new resultLine('smallStraightScore', smallStraightScore(this.dice));
        results['largeStraightScore'] = new resultLine('largeStraightScore', largeStraightScore(this.dice));
        results['chanceScore'] = new resultLine('chanceScore', chanceScore(this.dice));
        results['yatzyScore'] = new resultLine('yatzyScore', yatzyScore(this.dice));

        this.totalScore = (results) => {
            let sum = 0;
            for (const resultLine of results) {
                sum += resultLine.score;
            }
            return sum;
        }
    }

    /**
     * 
     * @returns up to date gameState object
     */
    gameState() {
        let totalScore = 0;
        for (const resultLine of this.results.filter(resultLine = !resultLine.used)) {
            resultLine.score = resultLine.calculater();
            totalScore += resultLine.score;
        }
        this.turnCounter++;
        if (this.turnCounter == 15) {
            this.finished = true;
        }
        return { turnNr: this.turnCounter, result: { list: this.results, totalScore: totalScore }, finished: this.finished };
    }

    rollDice() {
        for (const die of this.dice) {
            die.roll();
        }
    }

    diceHoldChange(index) {
        this.dice[index].hold = !this.dice[index].hold
    }

    choosePoint(name) {
        this.results[name].used = true;
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
        if (die.hold != true) {
            die.value = Math.floor(Math.random() * 6 + 1)
        }
    }
}