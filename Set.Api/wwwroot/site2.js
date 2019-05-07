import {
    URL,
    COUNTS,
    FILLS,
    COLORS,
    SHAPES,
    OPTION1,
    OPTION2,
    OPTION3,
    DEFAULT_BORDER,
    SELECTED_BORDER,
    INVALID_BORDER,
    VALID_BORDER,
    WIN_STATE,
    CARDS_REMAINING,
} from './constants.js'
import { SelectedCards } from './gamestate.js'

class Game {
    constructor() {
        this.winStatus = false;
        this.validSet = false;
        this.selectedCards = new SelectedCards();
        this.board = [];
        this.gameID = 0;
        this.createBoard();
    }

    async createBoard() {
        const response = await fetch(`${URL}/initgame`);
        const data = await response.json();
        this.gameID = data.gameID;
        this.board = [];
        for (const card of data.cards) {
            this.board.push([COUNTS[card.count], FILLS[card.fill], COLORS[card.color], SHAPES[card.shape]]);
        }
        this.renderBoard(this.board, this.winStatus);
    }

    createCard(count, fill, color, shape) {
        const imgurl = "/images/";
        const cardValue = `${count},${fill},${color},${shape}`;
        const cardImage = document.createElement("img");
        cardImage.src = `${imgurl}${cardValue}.png`;
        cardImage.alt = cardValue;
        cardImage.id = cardValue;
        cardImage.className = DEFAULT_BORDER;
        cardImage.addEventListener("click", this.mark.bind(this));
        let a = { name: 'a' }
        return cardImage;
    }

    mark(e) {
        if (this.winStatus) {
            return;
        }

        if (this.selectedCards.hasCard(e.currentTarget)) {
            e.currentTarget.className = DEFAULT_BORDER;
            this.selectedCards.removeCard(e.currentTarget);
        } else {
            e.currentTarget.className = SELECTED_BORDER;
            this.selectedCards.addCard(e.currentTarget);
            if (this.selectedCards.getCount() == 3) {
                //checkCards();
            }
        }
    }

    renderBoard() {
        const board = document.getElementById('board');
        const numNodes = board.childNodes.length;
        for (let i = 0; i < numNodes; i++) {
            board.removeChild(board.childNodes[0]);
        }
        for (const cardCharacteristic of this.board) {
            const newCard = this.createCard(cardCharacteristic[0], cardCharacteristic[1], cardCharacteristic[2], cardCharacteristic[3]);
            if (this.winStatus) {
                newCard.className = WIN_STATE;
            }
            board.appendChild(newCard);
        }
    }
}


var game = new Game();
