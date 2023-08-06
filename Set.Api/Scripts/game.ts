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
    MAX_INT32
} from './constants.js'
import {
    changeBorder,
    resetBorder,
    createCardDTOsFromSelected,
    createCardImage,
    displayScores,
    formatTime,
    sleep,
    getName,
    Scores,
    CardResponse
} from './utilities.js'
import { SelectedCards, Card } from './cards.js'
import { Stopwatch } from './stopwatch.js'
import { getNewGame, getStartTime, postGuess, postWin } from './api.js'

type LocalGame = {
    dailyCompletedDate: string | null,
    gameId: string | null,
}

class DailyState {
    gameId: string | null = null;
    gameIsDaily: boolean = true;
    currentDay = new Date().toLocaleDateString();
    dailyCompletedDate: string | null = null;
    storageKey = 'game';

    get dailyCompleted() {
        return this.dailyCompletedDate !== null && this.dailyCompletedDate === this.currentDay;
    }

    constructor(){
        this.loadFromStorage();
        if(this.dailyCompletedDate !== null && this.dailyCompletedDate !== this.currentDay) {
            this.gameId = null;
            this.dailyCompletedDate = null;
            this.persistToStorage();
        }
    }

    newGame(gameId: string) {
        this.gameId = gameId;
        this.persistToStorage();
    }

    reset() {
        this.gameId = null;
        this.persistToStorage();
    }

    gameCompleted() {
        this.dailyCompletedDate = this.currentDay;
        this.persistToStorage();
    }

    requestNewGame() {
        return {
            isDaily: !this.dailyCompleted,
            userLocalTime: this.currentDay,
            gameId: this.gameId
        }
    }

    private loadFromStorage() {
        const gameJson = localStorage.getItem(this.storageKey);
        if (!gameJson) return;
        const game = <LocalGame>JSON.parse(gameJson);
        this.dailyCompletedDate = game.dailyCompletedDate;
        this.gameId = game.gameId;
    }

    private persistToStorage() {
        localStorage.setItem(
            this.storageKey,
            JSON.stringify(<LocalGame>{
                dailyCompletedDate: this.dailyCompletedDate,
                gameId: this.gameId,
            }));
    }
}

export class Game {
    winStatus: boolean;
    validSet: boolean;
    selectedCards: SelectedCards;
    board: Card [];
    gameID: string;
    gameText: string;
    stopWatch?: Stopwatch;
    topScores: Scores [];
    dailyScores: Scores [];
    setHistory: string [] [];
    gameTime?: string;
    version: number;
    dailyState = new DailyState();
    
    constructor() {
        this.winStatus = false;
        this.validSet = false;
        this.selectedCards = new SelectedCards();
        this.board = [];
        this.gameID = "";
        this.topScores = [];
        this.dailyScores = [];
        this.setHistory = [];
        this.gameText = "";
        this.version = 0;

        this.createGame();
    }

    async createGame() {
        let newGame = await getNewGame(this.dailyState.requestNewGame());
        this.dailyState.newGame(newGame.gameID);
        this.gameID = newGame.gameID;
        this.topScores = newGame.topScores;
        this.dailyScores = newGame.dailyScores;
        this.updateBoard(newGame.cards);
        this.gameText = "Cards Remaining: " + newGame.cardsRemaining;
        this.version = newGame.version;
        const startData = await getStartTime(this.gameID);
        this.stopWatch = new Stopwatch(startData.startTime);
        this.renderGame();
    }

    updateBoard(cards: CardResponse []) {
        this.board = [];
        for (const card of cards) {
            this.board.push(new Card(COUNTS[card.count], FILLS[card.fill], COLORS[card.color], SHAPES[card.shape]));
        }
    }


    async markCard (e: MouseEvent) {
        if (this.winStatus || this.selectedCards.getCount() >= 3) {
            return;
        }
        const target = e.currentTarget as HTMLImageElement;

        if (this.selectedCards.hasCard(target.id)) {
            changeBorder(this.board, [target.id], DEFAULT_BORDER);
            this.selectedCards.removeCard(target.id);
        } else {
            changeBorder(this.board, [target.id], SELECTED_BORDER);
            this.selectedCards.addCard(target.id);
            if (this.selectedCards.getCount() >= 3) {
                this.renderGame();
                await this.makeGuess();
            }
        }
        this.renderGame();
    }


    renderGame() {
        const dailyCompleted = this.dailyState.dailyCompleted;
        let d = new Date();
        let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
        let month = new Intl.DateTimeFormat('en', { month: 'long' }).format(d);
        let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
        document.getElementById('subheader')!.textContent = `The daily game for ${month} ${day}, ${year}`;
        document.getElementById('resetButton')!.style.display = dailyCompleted ? 'block' : 'none';
        document.getElementById('subheader')!.style.display = dailyCompleted ? 'none' : 'block';
        const board = document.getElementById('board')!;
        board.innerHTML = "";
        for (const cardObj of this.board) {
            const newCard = createCardImage(cardObj.count, cardObj.fill, cardObj.color, cardObj.shape, cardObj.cardBorder, this.version);
            newCard.addEventListener("click", this.markCard.bind(this));
            board.appendChild(newCard);
        }

        if (this.winStatus) {
            const time = document.getElementById("time")!;
            time.innerText = this.gameTime!;
        }

        document.getElementById("deckCount")!.innerText = this.gameText;
        displayScores("topscore", this.topScores);
        displayScores("dailyscore", this.dailyScores);

        const prevSets = document.getElementById("sethistory")!;
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
                const card = createCardImage(characteristics[0], characteristics[1], characteristics[2], characteristics[3], VALID_BORDER, this.version);
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
        const body = await postGuess(guess);
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
        this.stopWatch!.stop();
        await this.resetGame();
    }

    async resetGame () {
        this.dailyState.reset();
        await this.createGame();
        this.gameText = CARDS_REMAINING;
        this.winStatus = false;
        this.validSet = false;
        this.setHistory = [];
        this.renderGame();
    };

    async enterWinState() {
        this.stopWatch!.stop();
        this.winStatus = true;
        this.gameText = "No more sets present!";
        for (const card of this.board) {
            changeBorder(this.board, [`${card.count},${card.fill},${card.color},${card.shape}`], WIN_STATE);
        }
        this.dailyState.gameCompleted();
        this.renderGame();
        const name = getName("You found all sets! Enter in your name here: ");
        const body = await postWin({ gameID: this.gameID, playerName: name});
        this.gameTime = formatTime(body.gameTime);
        this.topScores = body.topScores;
        this.dailyScores = body.dailyScores;
        this.renderGame();
    }
}