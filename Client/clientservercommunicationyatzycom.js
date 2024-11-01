
async function get(url) {
    const respons = await fetch('localhost/8000' + url);
    if (respons.status !== 200) // OK
        throw new Error(respons.status);
    return await respons.json();
}

async function post(url, object) {
    const respons = await fetch('localhost/8000' + url, {
        method: 'POST',
        body: JSON.stringify(object),
        headers: { 'Content-Type': 'application/json' }
    });
    if (respons.status !== 201) // Created
        throw new Error(respons.status);
    return await respons.text();
}

export async function getDice() {
    let dice;
    try {
        dice = await get("/dice");
    } catch (fejl) {
        console.log(fejl);
    }
    console.log(dice);
    return dice
}

export async function getGamestate() {
    let gamestate;
    try {
        gamestate = await get("/gamestate");
    } catch (fejl) {
        console.log(fejl);
    }
    console.log(gamestate);
    return gamestate
}

export async function postRoll(roll) {
    try {
        let respons = await post("/roll", roll);
        console.log(respons);
    } catch (fejl) {
        console.log(fejl);
    }
}

export async function postLockDice(number) {
    try {
        let respons = await post("/lockDice", number);
        console.log(respons);
    } catch (fejl) {
        console.log(fejl);
    }
}

export async function postChoosePoint(name) {
    try {
        let respons = await post("/choosePoint", name);
        console.log(respons);
    } catch (fejl) {
        console.log(fejl);
    }
}


