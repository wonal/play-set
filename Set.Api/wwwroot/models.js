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
        this.selectedCards = [];
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

