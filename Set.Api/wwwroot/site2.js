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
import { SelectedCards, Card } from './gamestate.js'

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
            this.board.push(new Card(COUNTS[card.count], FILLS[card.fill], COLORS[card.color], SHAPES[card.shape]));
        }
        this.renderBoard(this.board, this.winStatus);
    }

    createCard(count, fill, color, shape, border) {
        const imgurl = "/images/";
        const cardValue = `${count},${fill},${color},${shape}`;
        const cardImage = document.createElement("img");
        cardImage.src = `${imgurl}${cardValue}.png`;
        cardImage.alt = cardValue;
        cardImage.id = cardValue;
        cardImage.className = border;
        cardImage.addEventListener("click", this.mark);
        return cardImage;
    }

    mark = (e) => {
        if (this.winStatus) {
            return;
        }

        if (this.selectedCards.hasCard(e.currentTarget.id)) {
            this.changeBorder(e.currentTarget.id, DEFAULT_BORDER);
            this.selectedCards.removeCard(e.currentTarget.id);
        } else {
            this.changeBorder(e.currentTarget.id, SELECTED_BORDER);
            this.selectedCards.addCard(e.currentTarget.id);
            if (this.selectedCards.getCount() == 3) {
                //checkCards();
            }
        }
        this.renderBoard();
    }

    changeBorder(cardID, border) {
        for (const card of this.board) {
            if (`${card.count},${card.fill},${card.color},${card.shape}` === cardID) {
                card.cardBorder = border;
                break;
            }
        }
    }

    renderBoard() {
        const board = document.getElementById('board');
        const numNodes = board.childNodes.length;
        for (let i = 0; i < numNodes; i++) {
            board.removeChild(board.childNodes[0]);
        }
        for (const cardObj of this.board) {
            const newCard = this.createCard(cardObj.count, cardObj.fill, cardObj.color, cardObj.shape, cardObj.cardBorder);
            if (this.winStatus) {
                newCard.cardBorder = WIN_STATE;
            }
            board.appendChild(newCard);
        }
    }
}


var game = new Game();
