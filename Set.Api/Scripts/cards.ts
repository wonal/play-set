export class SelectedCards {
    count: number;
    cards: string [];
    firstSelect: boolean;

    constructor (){
        this.count = 0;
        this.cards = [];
        this.firstSelect = false;
    }

    getCount() {
        return this.count;
    }

    hasCard(cardID: string) {
        for (let i = 0; i < this.count; i++) {
            if (this.cards[i] === cardID) {
                return true;
            }
        }
        return false;
    }

    getSelectedCards() {
        return this.cards;
    }

    reset() {
        this.cards = [];
        this.count = 0;
    }

    addCard(cardID: string) {
        this.cards.push(cardID);
        this.count += 1;
    }

    removeCard(cardID: string) {
        for (let i = 0; i < this.count; i++) {
            if (this.cards[i] === cardID) {
                this.cards.splice(i, 1);
            }
        }
        this.count -= 1;
    }
};

export class Card {
    count: string;
    fill: string;
    color: string;
    shape: string;
    cardBorder: string;

    constructor(count: string, fill: string, color: string, shape: string) {
        this.count = count;
        this.fill = fill;
        this.color = color; 
        this.shape = shape;
        this.cardBorder = "default";
    }
}

