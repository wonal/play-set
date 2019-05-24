﻿import {
    URL,
    COUNTS,
    FILLS,
    COLORS,
    SHAPES,
    DEFAULT_BORDER,
    SELECTED_BORDER,
    INVALID_BORDER,
    VALID_BORDER,
    WIN_STATE,
    CARDS_REMAINING,
    MAX_INT32
} from './constants.js'
import {
    changeBorder,
    resetBorder,
    createCardDTOsFromSelected,
    createCardImage,
    formatTime,
    sleep,
    getName
} from './utilities.js'
import { SelectedCards, Card } from './cards.js'
import { Stopwatch } from './stopwatch.js'

export class Game {
    constructor() {
        this.winStatus = false;
        this.validSet = false;
        this.selectedCards = new SelectedCards();
        this.board = [];
        this.seed = null;
        this.seedMode = false;
        this.gameID = 0;
        this.gameText = CARDS_REMAINING;
        this.stopWatch = null;
        this.topScores = [];
        this.setHistory = [];

        this.createGame();
    }

    async createGame() {
        const fetchData = {
            method: 'POST',
            body: JSON.stringify({ seed: this.seed }),   
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept-Encoding': 'application/json'
            })
        };
        const response = await fetch(`${URL}/newgame`, fetchData);
        const data = await response.json();
        this.gameID = data.gameID;
        this.topScores = data.topScores;
        this.seed = data.seedValue;
        this.updateBoard(data.cards);
        const startResponse = await fetch(`${URL}/markstart/${this.gameID}`);
        const startData = await startResponse.json();
        this.stopWatch = new Stopwatch(startData.startTime);
        this.renderGame();
    }

    updateBoard(cards) {
        this.board = [];
        for (const card of cards) {
            this.board.push(new Card(COUNTS[card.count], FILLS[card.fill], COLORS[card.color], SHAPES[card.shape]));
        }
    }


    async markCard (e) {
        if (this.winStatus || this.selectedCards.getCount() >= 3) {
            return;
        }

        if (this.selectedCards.hasCard(e.currentTarget.id)) {
            changeBorder(this.board, [e.currentTarget.id], DEFAULT_BORDER);
            this.selectedCards.removeCard(e.currentTarget.id);
        } else {
            changeBorder(this.board, [e.currentTarget.id], SELECTED_BORDER);
            this.selectedCards.addCard(e.currentTarget.id);
            if (this.selectedCards.getCount() >= 3) {
                this.renderGame();
                await this.makeGuess();
            }
        }
        this.renderGame();
    }


    renderGame() {
        const board = document.getElementById('board');
        board.innerHTML = "";
        for (const cardObj of this.board) {
            const newCard = createCardImage(cardObj.count, cardObj.fill, cardObj.color, cardObj.shape, cardObj.cardBorder);
            newCard.addEventListener("click", this.markCard.bind(this));
            board.appendChild(newCard);
        }

        if (this.winStatus) {
            const time = document.getElementById("time");
            time.innerText = this.gameTime;
        }

        document.getElementById("deckCount").innerText = this.gameText;

        const scoreBoard = document.getElementById("topscore");
        scoreBoard.innerText = "";
        const seedValue = document.getElementById("seedvalue");
        seedValue.innerText = `Seed: ${this.seed}`;

        if (this.seedMode === false) {
            let scores = "Top Scores:\n";
            const actualScores = this.topScores.length;
            for (let i = 0; i < 5; i++) {
                if (i < actualScores) {
                    scores += `${i + 1}. ${this.topScores[i].name} -- ${formatTime(this.topScores[i].time)}\n`
                }
                else {
                    scores += `${i + 1}.\n`
                }
            }
            scoreBoard.innerText = scores;
        }

        const prevSets = document.getElementById("sethistory");
        if (this.setHistory.length > 0) {
            prevSets.style.visibility = "visible";
        }
        else {
            prevSets.style.visibility = "hidden";
        }
        prevSets.innerHTML = "";

        for (let i = this.setHistory.length - 1; i > -1; i--) {
            const div = document.createElement("div");
            div.className = "previousrow";
            prevSets.appendChild(div);
            for (const set of this.setHistory[i]) {
                const column = document.createElement("div");
                column.className = "previouscolumn";
                const characteristics = set.split(",");
                const card = createCardImage(characteristics[0], characteristics[1], characteristics[2], characteristics[3], VALID_BORDER);
                card.className = "history previousset";
                div.appendChild(column);
                column.appendChild(card);
            }
        }
    }

    async makeGuess() {
        const guessedCards = [...this.selectedCards.getSelectedCards()];
        const cardDTOs = createCardDTOsFromSelected(guessedCards);
        const guess = { GameID: this.gameID, Card1: cardDTOs[0], Card2: cardDTOs[1], Card3: cardDTOs[2] };

        const fetchData = {
            method: 'POST',
            body: JSON.stringify(guess),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept-Encoding': 'application/json'
            })
        };
        const response = await fetch(`${URL}/submitguess`, fetchData);
        const body = await response.json();
        if (body.validSet) {
            changeBorder(this.board, guessedCards, VALID_BORDER);
            this.setHistory.push([guessedCards[0], guessedCards[1], guessedCards[2]]);
            this.renderGame();
            await sleep(600);
            this.updateBoard(body.board);
            if (body.winState) {
                await this.enterWinState();
            }
            else {
                resetBorder(this.board);
                this.gameText = "Cards Remaining:" + body.cardsRemaining;
            }
        }
        else {
            changeBorder(this.board, guessedCards, INVALID_BORDER);
            this.renderGame();
            await sleep(600);
            resetBorder(this.board);
            this.updateBoard(body.board);
        }
        this.selectedCards.reset();
    }

    async createNewGame() {
        this.seed = null;
        this.seedMode = false;
        this.stopWatch.stop();
        await this.resetGame();
    }

    async createSeedGame() {
        let number = window.prompt("Enter an integer seed value (no decimals or fractions): ")
        while (number != null && (number === "" || Number.isInteger(Number(number)) === false)) {
            number = window.prompt("That is not a valid number.  Please enter an integer value for a seed: ")
        }
        if (number === null) {
            return;
        }
        this.seed = (parseInt(number, 10)) % MAX_INT32;
        this.seedMode = true;
        this.stopWatch.stop();
        await this.resetGame();
    }

    async resetGame () {
        await this.createGame();
        this.gameText = CARDS_REMAINING;
        this.winStatus = false;
        this.validSet = false;
        this.setHistory = [];
        this.renderGame();
    };

    async enterWinState() {
        this.stopWatch.stop();
        this.winStatus = true;
        this.gameText = "No more sets present!";
        for (const card of this.board) {
            changeBorder(this.board, [`${card.count},${card.fill},${card.color},${card.shape}`], WIN_STATE);
        }
        this.renderGame();
        const name = this.seedMode ? "" : getName();
        const fetchData = {
            method: 'POST',
            body: JSON.stringify({ GameID: this.gameID, PlayerName: name}),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept-Encoding': 'application/json'
            })
        };
        const response = await fetch(`${URL}/postwin`, fetchData);
        const body = await response.json();
        this.gameTime = formatTime(body.gameTime);
        this.topScores = body.topScores;
        this.renderGame();
    }

}
