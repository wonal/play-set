export class SelectedCards {

    constructor (){
        this.count = 0;
        this.selectedCards = [];
        this.firstSelect = false;
    }

    getCount() {
        return this.count;
    }

    hasCard(cardID) {
        for (let i = 0; i < this.count; i++) {
            if (this.selectedCards[i] === cardID) {
                return true;
            }
        }
        return false;
    }

    getSelectedCards() {
        return this.selectedCards;
    }

    reset() {
        this.selectedCards = []
        this.count = 0;
    }

    addCard(card) {
        this.selectedCards.push(card);
        this.count += 1;
    }

    removeCard(cardID) {
        for (let i = 0; i < this.count; i++) {
            if (this.selectedCards[i] === cardID) {
                this.selectedCards.splice(i, 1);
            }
        }
        this.count -= 1;
    }
};

export class Card {
    constructor(count, fill, color, shape) {
        this.count = count;
        this.fill = fill;
        this.color = color; 
        this.shape = shape;
        this.cardBorder = "default";
    }
}

export class Stopwatch {
    constructor() {
        this.startTime = 0;
        this.endTime = 0;
        this.totalTime = "Time --h:--m:--s";
    }

    markStart() {
        this.startTime = Date.now();
    }

    markEnd() {
        this.endTime = Date.now();
        this.totalTime = this.getTotalTime();
    }

    getTotalTime() {
        const duration = this.endTime - this.startTime;
        const seconds = Math.floor(duration / 1000) % 60;
        const minutes = Math.floor(duration / (1000 * 60)) % 60;
        const hours = Math.floor(duration / (1000 * 60 * 60)) % 60;

        return "Time: " + (hours < 10 ? "0" + hours : hours) +
            "h:" + (minutes < 10 ? "0" + minutes : minutes) +
            "m:" + (seconds < 10 ? "0" + seconds : seconds) + "s";
    }

    reset() {
        this.totalTime = "Time --h:--m:--s";
    }
}
