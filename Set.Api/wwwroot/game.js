import {
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
    DEFAULT_TIME,
    MAX_INT32
} from './constants.js'
import { attributeToOption, formatTime, sleep, getName } from './utilities.js'
import { SelectedCards, Card } from './cards.js'

export class Game {
    constructor() {
        this.winStatus = false;
        this.validSet = false;
        this.selectedCards = new SelectedCards();
        this.board = [];
        this.seedMode = false;
        this.seedValue = 0;
        this.gameID = 0;
        this.gameText = CARDS_REMAINING;
        this.gameTime = DEFAULT_TIME;
        this.topScores = [];
        this.setHistory = [];

        this.createBoard();
    }

    async createBoard() {
        const fetchData = {
            method: 'POST',
            body: JSON.stringify({HasSeed: this.seedMode, SeedValue: this.seedValue}),   
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept-Encoding': 'application/json'
            })
        };
        const response = await fetch(`${URL}/newgame`, fetchData);
        const data = await response.json();
        this.gameID = data.gameID;
        this.topScores = data.topScores;
        this.updateBoard(data.cards);
        this.renderGame();
        await fetch(`${URL}/markstart/${this.gameID}`);
    }

    updateBoard(cards) {
        this.board = [];
        for (const card of cards) {
            this.board.push(new Card(COUNTS[card.count], FILLS[card.fill], COLORS[card.color], SHAPES[card.shape]));
        }
    }

    createCardImage(count, fill, color, shape, border) {
        const cardValue = `${count},${fill},${color},${shape}`;
        const cardImage = document.createElement("img");
        cardImage.src = `/images/${cardValue}.png`;
        cardImage.alt = cardValue;
        cardImage.id = cardValue;
        cardImage.className = border;
        return cardImage;
    }

    async markCard (e) {
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
                this.renderGame();
                await this.makeGuess();
            }
        }
        this.renderGame();
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

    renderGame() {
        const board = document.getElementById('board');
        board.innerHTML = "";
        for (const cardObj of this.board) {
            const newCard = this.createCardImage(cardObj.count, cardObj.fill, cardObj.color, cardObj.shape, cardObj.cardBorder);
            newCard.addEventListener("click", this.markCard.bind(this));
            board.appendChild(newCard);
        }

        const time = document.getElementById("time");
        time.innerText = this.gameTime;

        document.getElementById("deckCount").innerText = this.gameText;

        const scoreBoard = document.getElementById("topscore");
        scoreBoard.innerText = "";
        const seedValue = document.getElementById("seedvalue");
        seedValue.innerText = "";

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
        else {
            seedValue.innerText = `Seed: ${this.seedValue}`;
        }
        
        const prevSets = document.getElementById("thirdcolumn");
        prevSets.innerHTML = "";

        for (let i = this.setHistory.length - 1; i > -1; i--) {
            const div = document.createElement("div");
            div.className = "row";
            prevSets.appendChild(div);
            for (const set of this.setHistory[i]) {
                const column = document.createElement("div");
                column.className = "previouscolumn";
                const characteristics = set.split(",");
                const card = this.createCardImage(characteristics[0], characteristics[1], characteristics[2], characteristics[3], VALID_BORDER);
                card.className = "history previousset";
                div.appendChild(column);
                column.appendChild(card);
            }
        }
    }

    async makeGuess() {
        const selectedCards = this.createCardsFromSelected();
        const id = this.gameID;

        const fetchData = {
            method: 'POST',
            body: JSON.stringify({ GameID: id, Card1: selectedCards[0], Card2: selectedCards[1], Card3: selectedCards[2] }),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept-Encoding': 'application/json'
            })
        };
        const response = await fetch(`${URL}/submitguess`, fetchData);
        const body = await response.json();
        if (body.validSet) {
            this.changeBorder(this.selectedCards.getSelectedCards(), VALID_BORDER);
            this.setHistory.push(this.selectedCards.getSelectedCards());
            this.renderGame();
            await sleep(600);
            this.updateBoard(body.board);
            if (body.winState) {
                await this.enterWinState();
            }
            else {
                this.changeBorder(this.selectedCards.getSelectedCards(), DEFAULT_BORDER);
                this.gameText = "Cards remaining:" + body.cardsRemaining;
            }
        }
        else {
            this.changeBorder(this.selectedCards.getSelectedCards(), INVALID_BORDER);
            this.renderGame();
            await sleep(600);
            this.changeBorder(this.selectedCards.getSelectedCards(), DEFAULT_BORDER);
            this.updateBoard(body.board);
        }
        this.selectedCards.reset();
    }

    async timedGame() {
        this.seedMode = false;
        this.seedValue = 0;
        await this.resetGame();
    }

    async seedGame() {
        let number = window.prompt("Enter an integer seed value (no decimals or fractions): ")
        while (number != null && (number === "" || Number.isInteger(Number(number)) === false)) {
            number = window.prompt("That is not a valid number.  Please enter an integer value for a seed: ")
        }
        if (number === null) {
            return;
        }
        this.seedMode = true;
        this.seedValue = Math.abs(parseInt(number, 10)) % MAX_INT32;
        await this.resetGame();
    }

    async resetGame () {
        const fetchData = {
            method: 'POST',
            body: JSON.stringify({HasSeed: this.seedMode, SeedValue: this.seedValue}),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept-Encoding': 'application/json'
            })
        };
        const response = await fetch(`${URL}/newgame`, fetchData);
        const data = await response.json();
        this.updateBoard(data.cards);
        this.gameID = data.gameID;
        this.gameText = CARDS_REMAINING;
        this.winStatus = false;
        this.validSet = false;
        this.gameTime = DEFAULT_TIME;
        this.renderGame();
    };

    async enterWinState() {
        this.winStatus = true;
        this.gameText = "No more sets present!";
        for (const card of this.board) {
            this.changeBorder([`${card.count},${card.fill},${card.color},${card.shape}`], WIN_STATE);
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

    createCardsFromSelected() {
        const cards = [];
        for (let j = 0; j < 3; j++) {
            const card = this.selectedCards.getSelectedCards()[j].split(",");
            const selectedCard = {
                Count: attributeToOption(card[0], "one", "three"),
                Fill: attributeToOption(card[1], "solid", "hollow"),
                Color: attributeToOption(card[2], "red", "purple"),
                Shape: attributeToOption(card[3], "circle", "diamond")
            };
            cards.push(selectedCard);
        }
        return cards;
    }
}
