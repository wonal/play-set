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

class Game {
    constructor() {
        this.winStatus = false;
        this.validSet = false;
        this.selectedCards = [];
        this.board = [];
        this.gameID = 0;
        this.createBoard();
        console.log("game created");
    }

    async createBoard() {
        const response = await fetch(`${URL}/initgame`);
        const data = await response.json();
        this.gameID = data.gameID;
        this.board = [];
        for (const card of data.cards) {
            this.board.push([COUNTS[card.count], FILLS[card.fill], COLORS[card.color], SHAPES[card.shape]]);
        }
        console.log("fetched initial game cards");
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
        cardImage.addEventListener("click", this.mark);
        return cardImage;
    }

    mark(e) {
        if (this.gameWon) {
            return;
        }
        return;
    }

    renderBoard() {
        console.log("render board");
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

const game = new Game();
const modal = document.querySelector(".modal");
const trigger = document.querySelector(".trigger");
const closeButton = document.querySelector(".close-button");

function toggleModal() {
    modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}

(function () {
    trigger.addEventListener("click", toggleModal);
    closeButton.addEventListener("click", toggleModal);
    window.addEventListener("click", windowOnClick);

})
