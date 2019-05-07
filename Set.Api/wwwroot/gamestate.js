export class SelectedCards {

    constructor (){
        this.count = 0;
        this.selectedCards = [];
    }

    getCount() {
        return this.count;
    }

    hasCard(card) {
        for (let i = 0; i < this.count; i++) {
            if (this.selectedCards[i] === card) {
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

    removeCard(card) {
        for (let i = 0; i < this.count; i++) {
            if (this.selectedCards[i] === card) {
                this.selectedCards.splice(i, 1);
            }
        }
        this.count -= 1;
    }
};
