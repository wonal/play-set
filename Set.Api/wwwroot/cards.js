export class SelectedCards {

    constructor (){
        this.count = 0;
        this.cards = [];
        this.firstSelect = false;
    }

    getCount() {
        return this.count;
    }

    hasCard(cardID) {
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

    addCard(card) {
        this.cards.push(card);
        this.count += 1;
    }

    removeCard(cardID) {
        for (let i = 0; i < this.count; i++) {
            if (this.cards[i] === cardID) {
                this.cards.splice(i, 1);
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

