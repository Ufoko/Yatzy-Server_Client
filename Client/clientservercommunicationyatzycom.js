let clientId = 1;

async function get(url) {
    const respons = await fetch('http://localhost:11111' + url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (respons.status !== 200) // OK
        throw new Error(respons.status);
    return await respons.json();
}

async function post(url, object) {
    const respons = await fetch('http://localhost:11111' + url, {
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
    return dice
}

export async function getGamestate() {
    let gamestate;
    try {
        gamestate = await get("/gamestate", {id: clientId});
    } catch (fejl) {
        console.log(fejl);
    }
    console.log(gamestate);
    return gamestate
}

export async function postRoll() {
    try {
        let respons = await post("/roll");
        console.log(respons);
    } catch (fejl) {
        console.log(fejl);
    }
}

export async function postLockDice(number) {
    try {
        let respons = await post("/lockDice", {number:number});
        console.log(respons);
    } catch (fejl) {
        console.log(fejl);
    }
}

export async function postChoosePoint(name) {
    try {
        let respons = await post("/choosePoint", {name:name});
        console.log(respons);
    } catch (fejl) {
        console.log(fejl);
    }
}


