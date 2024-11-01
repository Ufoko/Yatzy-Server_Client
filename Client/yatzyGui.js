//import { allTaken, assignResult, bonus, getNextCount, getNextTurn, getResults, nextTurn, results, startUp, sum, takenThisRound, totalScore } from './gamestate.js'
//import { createDice, holdDie, rollDice, getDice, getDieState, resetDice } from './yatzyLogic.js'
import { getDice, getGamestate, postRoll, postLockDice, postChoosePoint, postChoosePoint } from "./clientservercommunicationyatzycom";

/* Gemmer nogle elementer, som vi skal bruge i løbet at spillet*/
const turnHeader = document.querySelector("h2");

const rollButton = document.querySelector("#roll")    /* Får fat i "Roll Again" Knappen*/
rollButton.onclick = () => rollTheDice()

const roundButton = document.querySelector("#next-round")    /* Får fat i "Ny runde" Knappen*/
roundButton.onclick = () => newTurn()

const combinationDiv = document.getElementById('combinations')


/* En liste over alle mulige point felter (Ud over bonus og Result) */
let options = [
"1-s", "2-s", "3-s", "4-s", "5-s", "6-s", "One Pair", "Two Pairs",
    "Three Same", "Four Same", "Full House",
    "Small Staight", "Large Straight", "Chance", "Yatzy"
]

startGame()


/* 
Start game tegner de nødvendige HTML elementer med de ønskedede funktioner,
kalder startUp() på gamestate, så den kan initialisere sin results[],
og createDice(), så nye terninger oprettes
*/
function startGame () {
    drawCombinations()
    createDice()
    setOnClick()
    startUp()
    newTurn()
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
    rollDice()
    setDice()
    setOnClick() /* Vi er nødt til at kalde setOnClick igen, da vi teknisk set får lavet nye objekter*/
    updateResults() /* Vi opdatere resultaterne til højre */
    updateCount() /* Opdatere*/
}


async function drawCombinations() {
    combinationDiv.innerHTML = "";
    /* Løber alle "options" igennem, for at oprette alle resultat felter og tekster */
    for (let index = 0; index < options.length; index++) {
        /* Tilføjer teksten*/
        combinationDiv.innerHTML = combinationDiv.innerHTML + options[index];

        /* Tilføjer knappen med scoren i*/
        combinationDiv.innerHTML = combinationDiv.innerHTML + '<button id="button' + index + '" class="result-button"></button>'

        /* Tilføjer to tomme paragrafer eller summen/bonus. */
        if (index == 4) {
            combinationDiv.innerHTML = combinationDiv.innerHTML + 'Sum <button id="buttonSum" class="result-button"></button>'
        } else if (index == 5) {
            combinationDiv.innerHTML = combinationDiv.innerHTML + 'Bonus <button id="buttonBonus" class="result-button"></button>'
        } else {
            combinationDiv.innerHTML = combinationDiv.innerHTML + "<p>" + "<p>"
        }
    }

    /* Giver dem alle sammen en onclick funktion */
    for (let i = 0; i < options.length; i++) {
        let resultButton = document.querySelector('#button' + i);
        resultButton.onclick = async function () {
            postChoosePoint(i)
            
            let gamestate = await getGamestate()
            setTurn(gamestate.turnNr)
            setT
            
            let succeed = assignResult(i);
            if (succeed) {
                resultButton.className = "result-button-clicked";
            }
        }
    }
}

function setTurn(turnNr) {
    turnHeader.innerHTML = "Turn " + turnNr;
}


/* 
Kaldes hver gang en ny tur begynder.
Holder også øje med om vi er er færdige med hele spillet, og viser så et tilsvarende vindue
*/
function newTurn() {
    if (allTaken()) {
        let text = "Du opnåede en score på " + totalScore() + "\n Vil du starte et ny spil?";
        if (confirm(text)) {
            startGame();
          }
    } else if (takenThisRound()) {

        let rollsLeft = document.querySelector("#rolls-left");
        rollsLeft.innerHTML = 3;
        nextTurn();
        rollButton.disabled = false;
        document.querySelector("#total").innerHTML = totalScore();
        resetDice();
        rollTheDice()
    } else {
        alert("Du skal vælge et resultat at gemme.")
    }
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
function updateResults() {
    let resultArray = getResults()
    for (let index = 0; index < resultArray.length; index++) {
        document.querySelector("#button" + index).innerHTML = resultArray[index].value
    }
    document.querySelector("#buttonSum").innerHTML = sum();
    document.querySelector("#buttonBonus").innerHTML = bonus()

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