//import { allTaken, assignResult, bonus, getNextCount, getNextTurn, getResults, nextTurn, results, startUp, sum, takenThisRound, totalScore } from './gamestate.js'
//import { createDice, holdDie, rollDice, getDice, getDieState, resetDice } from './yatzyLogic.js'
import { getDice, getGamestate, postRoll, postLockDice, postChoosePoint } from "./clientservercommunicationyatzycom.js";

/* Gemmer nogle elementer, som vi skal bruge i løbet at spillet*/
const turnHeader = document.querySelector("h2");

const rollButton = document.querySelector("#roll")    /* Får fat i "Roll Again" Knappen*/
rollButton.onclick = () => rollTheDice()

const roundButton = document.querySelector("#next-round")    /* Får fat i "Ny runde" Knappen*/
// roundButton.onclick = () => newTurn()

const combinationDiv = document.getElementById('combinations')

let nameIndex = new Map();
let index;
for (index = 1; index <= 6; index++) {
    nameIndex.set(index, index + '-s');
}
nameIndex.set(index++, 'onePair')
nameIndex.set(index++, 'twoPair')
nameIndex.set(index++, 'threeOfAKinde')
nameIndex.set(index++, 'fourOfAkind')
nameIndex.set(index++, 'fullHouseScore')
nameIndex.set(index++, 'smallStraightScore')
nameIndex.set(index++, 'largeStraightScore')
nameIndex.set(index++, 'chanceScore')
nameIndex.set(index++, 'yatzyScore')

startGame()


/* 
Start game tegner de nødvendige HTML elementer med de ønskedede funktioner,
kalder startUp() på gamestate, så den kan initialisere sin results[],
og createDice(), så nye terninger oprettes
*/
function startGame() {
    console.log("Starter client")
    drawCombinations()
    setOnClick()
    updateGamestate()
    // startUp()
    // newTurn()
}


function setOnClick() {
    /**
     * Die buttons
     */
    const dieButton0 = document.querySelector("#die0")
    const dieButton1 = document.querySelector("#die1")
    const dieButton2 = document.querySelector("#die2")
    const dieButton3 = document.querySelector("#die3")
    const dieButton4 = document.querySelector("#die4")
    dieButton0.onclick = () => holdDieGUI(0)
    dieButton1.onclick = () => holdDieGUI(1)
    dieButton2.onclick = () => holdDieGUI(2)
    dieButton3.onclick = () => holdDieGUI(3)
    dieButton4.onclick = () => holdDieGUI(4)
}

function rollTheDice() {
    postRoll()
    setDice()
    setOnClick() /* Vi er nødt til at kalde setOnClick igen, da vi teknisk set får lavet nye objekter*/
    updateGamestate();
}

function drawCombinations() {
    combinationDiv.innerHTML = "";
    /* Løber alle "options" igennem, for at oprette alle resultat felter og tekster */
    for (let index = 1; index < nameIndex.size + 1; index++) {
        /* Tilføjer teksten*/
        combinationDiv.innerHTML = combinationDiv.innerHTML + nameIndex[index];

        /* Tilføjer knappen med scoren i*/
        combinationDiv.innerHTML = combinationDiv.innerHTML + '<button id="button' + index + '" class="result-button"></button>'

        /* Tilføjer to tomme paragrafer eller summen/bonus. */
        if (index == 5) {
            combinationDiv.innerHTML = combinationDiv.innerHTML + 'Sum <button id="buttonSum" class="result-button"></button>'
        } else if (index == 6) {
            combinationDiv.innerHTML = combinationDiv.innerHTML + 'Bonus <button id="buttonBonus" class="result-button"></button>'
        } else {
            combinationDiv.innerHTML = combinationDiv.innerHTML + "<p>" + "<p>"
        }
    }
}

async function assignOnClick(resultList) {
    /* Giver dem alle sammen en onclick funktion */
    for (let index = 1; index < nameIndex.keys.length + 1; index++) {
        let resultButton = document.querySelector('#button' + index);
        resultButton.onclick = async function () {
            postChoosePoint(i)
            await updateGamestate()      
        }
    }
}

function setTurn(turnNr) {
    turnHeader.innerHTML = "Turn " + turnNr;
}


async function updateGamestate() {
    let gamestate = await getGamestate();
    setTurn(gamestate.turnNr);   

    let resultList = gamestate.result.list;
    let totalScore = gamestate.result.totalScore;
    let sum = gamestate.sumAndBonus.sum;
    let bonus = gamestate.sumAndBonus.bonus;
    updateResults(resultList, sum, bonus);
    updateTotalScore(totalScore);
    let finished = gamestate.finished;
}

function updateTotalScore(totalScore) {
    document.querySelector("#total").innerHTML = "Result: " + totalScore;
}

/*
Opdatere "rul tilbage" counteren, ved at hente rul tilbage fra gamestate.
Hvis der ikke er flere rul tilbage, så låses knappen
*/
function updateCount() {
    let count = getNextCount();
    if (count == 1) {
        rollButton.disabled = true;
    }
    let rollsLeft = document.querySelector("#rolls-left")
    rollsLeft.innerHTML = count - 1;
}

/* 
Opdatere alle resultaterne, ved at hente dem i gamestate, og derefter opdatere innerHTML i alle de tilsvarende elementer
*/
function updateResults(resultArray, sum, bonus) {
    for (let index = 0; index < resultArray.length; index++) {
        document.querySelector("#button" + index).innerHTML = resultArray[index].value
    }
    document.querySelector("#buttonSum").innerHTML = sum;
    document.querySelector("#buttonBonus").innerHTML = bonus
}

/*
Låser den givne terning nede i yatzyLogic, og giver det en ny klasse, så en ny css profil kan bruges
*/
function holdDieGUI(number) {
    postLockDice(number)
    setDice()
}

function setDice() {
    let dieArray = getDice()
    for (let i = 0; i < dieArray.length; i++) {
        if (!getDieState(i)) {
            let dieString = '<img id="die' + i + '" class="die" src="img\\dice-' + dieArray[i].value + '.svg" alt="dice' + (dieArray[i].value + 1) + '"></img>'
            let dieImage = document.querySelector("#die" + i)
            dieImage.outerHTML = dieString
        }
    }
}