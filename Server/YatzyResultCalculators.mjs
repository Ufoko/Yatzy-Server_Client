export function upperSectionScore(eyes, diceArray) {
    return () => {
        let counter = 0
        for (const die of diceArray) {
            if (die.value == eyes) {
                counter++
            }
        }
        return counter * eyes
    }
}


function findMathingEyes(diceArray, excludedPairSum, matchAmount) {
    let sumPair = 0

    let rolls = [0, 0, 0, 0, 0, 0]
    for (let die of diceArray) {
        rolls[die.value - 1] += 1
    }

    for (let index = 0; index < rolls.length; index++) {
        if (rolls[index] >= matchAmount && (index + 1) * matchAmount != excludedPairSum) {
            sumPair = matchAmount * (index + 1)
        }
    }
    return sumPair
}


export function onePairScore(dice) {
    return () => findMathingEyes(dice, 0, 2)
}

export function twoPairScore(dice) {
    return () => {
        let firstPair = findMathingEyes(dice, 0, 2)
        let secondPair = findMathingEyes(dice, firstPair, 2)
        let twoPairScore = 0
        if (firstPair != 0 && secondPair != 0) {
            twoPairScore = firstPair + secondPair
        }
        return twoPairScore
    }
}

export function threeOfAKindScore(dice) {
    return () => findMathingEyes(dice, 0, 3)
}

export function fourOfAKindScore(dice) {
    return () => findMathingEyes(dice, 0, 4)
}


export function smallStraightScore(dice) {
    return () => checkInARow(dice, 4) ? 15 : 0
}

//todo
export function checkInARow(diceArray, inARow) {
    let straightPossible = false
    let sortedDice = Array.from(new Set(diceArray)).sort((a, b) => a - b)
    let consecutives = 1;
    for (let index = 1; index < sortedDice.length; index++) {
        if (sortedDice[index] - sortedDice[index - 1] === 1) {
            consecutives++
            if (consecutives == inARow) {
                straightPossible = true;
            }
        }
        else {
            consecutives = 1;
        }
    }
    return straightPossible
}

export function largeStraightScore(dice) {
    return () => checkInARow(dice, 5) ? 20 : 0
}


export function fullHouseScore(dice) {
    return () => {
        let threeOfAkind = findMathingEyes(dice, 0, 3);
        let excludeSum = (threeOfAkind * 2) / 3;
        let twoOfAKind = findMathingEyes(dice, excludeSum, 2);
        let totalSum = 0;
        if (threeOfAkind != 0 && twoOfAKind != 0) {
            totalSum = threeOfAkind + twoOfAKind;
        }
        return totalSum;
    }
}

export function chanceScore(diceArray) {
    return () => {
        let chance = 0;
        for (const die of diceArray) {
            chance += die.value
        }
        return chance;
    }
}

export function yatzyScore(dice) {
    return () => findMathingEyes(dice, 0, 5) > 0 ? 50 : 0
}