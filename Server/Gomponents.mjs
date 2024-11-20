export class resultLine {
    constructor(name, calculator) {
        this.name = name;
        this.used = false;
        this.score = 0;
        this.calculater = calculator;
    }
}

export class die {
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

export class Statistic {
    constructor(name, id, calculator) {
        this.name = name;
        this.id = id;
        this.calculator = calculator;
    }
}