﻿import {
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
    DEFAULT_TIME
} from './constants.js'
import { SelectedCards, Card } from './models.js'

class Game {
    constructor() {
        this.winStatus = false;
        this.validSet = false;
        this.selectedCards = new SelectedCards();
        this.board = [];
        this.gameID = 0;
        this.gameText = CARDS_REMAINING;
        this.gameTime = DEFAULT_TIME;
        this.topScores = [];
        this.createBoard();
    }

    async createBoard() {
        const response = await fetch(`${URL}/initgame`);
        const data = await response.json();
        this.gameID = data.gameID;
        this.topScores = data.topScores;
        this.board = [];
        this.updateBoard(data.cards);
        this.renderBoard();
        const timeResponse = await fetch(`${URL}/markstart/${this.gameID}`);
    }

    updateBoard(cards) {
        this.board = [];
        for (const card of cards) {
            this.board.push(new Card(COUNTS[card.count], FILLS[card.fill], COLORS[card.color], SHAPES[card.shape]));
        }
    }

    createCardImage(count, fill, color, shape, border) {
        const imgurl = "/images/";
        const cardValue = `${count},${fill},${color},${shape}`;
        const cardImage = document.createElement("img");
        cardImage.src = `${imgurl}${cardValue}.png`;
        cardImage.alt = cardValue;
        cardImage.id = cardValue;
        cardImage.className = border;
        cardImage.addEventListener("click", this.markCard);
        return cardImage;
    }

    markCard = async (e) => {
        if (this.winStatus) {
            return;
        }

        if (this.selectedCards.hasCard(e.currentTarget.id)) {
            this.changeBorder([e.currentTarget.id], DEFAULT_BORDER);
            this.selectedCards.removeCard(e.currentTarget.id);
        } else {
            this.changeBorder([e.currentTarget.id], SELECTED_BORDER);
            this.selectedCards.addCard(e.currentTarget.id);
            if (this.selectedCards.getCount() == 3) {
                this.renderBoard();
                await this.checkCards();
            }
        }
        this.renderBoard();
    }

    changeBorder(cardIDs, borderColor) {
        const length = cardIDs.length;
        let numChanged = 0;
        for (const card of this.board) {
            for (const cardID of cardIDs) {
                if (numChanged >= length) {
                    return;
                }
                if (`${card.count},${card.fill},${card.color},${card.shape}` === cardID) {
                    card.cardBorder = borderColor;
                    numChanged += 1;
                }
            }
        }
    }

    formatTime(ms) {
        const seconds = Math.floor(ms / 1000) % 60;
        const minutes = Math.floor(ms / (1000 * 60)) % 60;
        const hours = Math.floor(ms / (1000 * 60 * 60)) % 60;

        return "Time: " + (hours < 10 ? "0" + hours : hours) +
            "h:" + (minutes < 10 ? "0" + minutes : minutes) +
            "m:" + (seconds < 10 ? "0" + seconds : seconds) + "s";
    }

    renderBoard() {
        const board = document.getElementById('board');
        const numNodes = board.childNodes.length;
        for (let i = 0; i < numNodes; i++) {
            board.removeChild(board.childNodes[0]);
        }
        for (const cardObj of this.board) {
            const newCard = this.createCardImage(cardObj.count, cardObj.fill, cardObj.color, cardObj.shape, cardObj.cardBorder);
            board.appendChild(newCard);
        }
        const time = document.getElementById("time");
        time.innerText = this.gameTime;
        document.getElementById("deckCount").innerText = this.gameText;
        const scoreBoard = document.getElementById("topscore");
        let scores = "Top Scores:\n";
        const actualScores = this.topScores.length;
        for (let i = 0; i < 5; i++) {
            if (i < actualScores) {
                scores += `${i+1}. ${this.topScores[i].name} -- ${this.formatTime(this.topScores[i].time)}\n`
            }
            else {
                scores += `${i+1}.\n`
            }
        }
        scoreBoard.innerText = scores;
    }

    resetGame = async () => {
        const response = await fetch(`${URL}/newgame/${this.gameID}`);
        const data = await response.json();
        this.updateBoard(data.cards);
        this.gameText = CARDS_REMAINING;
        this.winStatus = false;
        this.validSet = false;
        this.gameTime = DEFAULT_TIME;  
        this.renderBoard();
    }

    async checkCards() {
        const selectedCards = this.createCards();
        const id = this.gameID;

        const fetchData = {
            method: 'POST',
            body: JSON.stringify({ GameID: id, PlayerName: "Placeholder", Card1: selectedCards[0], Card2: selectedCards[1], Card3: selectedCards[2] }),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept-Encoding': 'application/json'
            })
        };
        const response = await fetch(`${URL}/validate`, fetchData);
        const body = await response.json();
        if (body.validSet) {
            this.changeBorder(this.selectedCards.selectedCards, VALID_BORDER);
            this.renderBoard();
            await this.sleep(600);
            this.updateBoard(body.board);
            if (body.winState) {
                this.winStatus = true;
                this.gameTime = this.formatTime(body.time);
                for (const card of this.board) {
                    this.changeBorder([`${card.count},${card.fill},${card.color},${card.shape}`], WIN_STATE);
                }
                this.topScores = body.topScores;  
                this.renderBoard();
                this.gameText = "No more sets present!";
            }
            else {
                this.changeBorder(this.selectedCards.selectedCards, DEFAULT_BORDER);
                this.gameText = "Cards remaining:" + body.cardsRemaining;
            }
        }
        else {
            this.changeBorder(this.selectedCards.selectedCards, INVALID_BORDER);
            this.renderBoard();
            await this.sleep(600);
            this.changeBorder(this.selectedCards.selectedCards, DEFAULT_BORDER);
            this.updateBoard(body.board);
        }
        this.selectedCards.reset();
    }

    createCards() {
        const cards = [];
        for (let j = 0; j < 3; j++) {
            const card = this.selectedCards.selectedCards[j].split(",");
            const selectedCard = {
                Count: this.attributeToOption(card[0], "one", "three"),
                Fill: this.attributeToOption(card[1], "solid", "hollow"),
                Color: this.attributeToOption(card[2], "red", "purple"),
                Shape: this.attributeToOption(card[3], "circle", "diamond")
            };
            cards.push(selectedCard);
        }
        return cards;
    }

    attributeToOption(attribute, option1Equivalent, option2Equivalent) {
        if (attribute.toLowerCase() === option1Equivalent) {
            return OPTION1;
        }
        else if (attribute.toLowerCase() === option2Equivalent) {
            return OPTION2;
        }
        else {
            return OPTION3;
        }
    }
    
    sleep(time) {
        const promise = new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve();
            }, time);
        });
        return promise;
    }
}

const game = new Game();

//logic for modal box taken from: https://sabe.io/tutorials/how-to-create-modal-popup-box
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
    const button = document.getElementById("resetButton");
    button.addEventListener("click", game.resetGame);
})()
