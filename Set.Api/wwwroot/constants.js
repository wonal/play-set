
export const URL = "/api/set";
export const COUNTS = ["one", "three", "six"];
export const FILLS = ["solid", "hollow", "stacked"];
export const COLORS = ["red", "purple", "yellow"];
export const SHAPES = ["circle", "diamond", "rectangle"];
export const OPTION1 = "Option1";
export const OPTION2 = "Option2";
export const OPTION3 = "Option3";
export const DEFAULT_BORDER = "image";
export const SELECTED_BORDER = "selected";
export const INVALID_BORDER = "invalid";
export const VALID_BORDER = "valid";
export const WIN_STATE = "win";
export const CARDS_REMAINING = "Cards remaining: 81";

export class SelectedCards {
    count = 0;
    selectedCards = [];

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

export class GameStatus {
    gameWon = false;
    gameID = "";

    getStatus() {
        return this.gameWon;
    }

    updateStatus(status) {
        this.gameWon = status;
    }

    setGameID(id) {
        this.gameID = id;
    }

    getGameID() {
        return this.gameID;
    }
};
