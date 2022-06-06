import { MultiplayerClient, postWin, SetGuessed } from "./api.js";
import { Card, SelectedCards } from "./cards.js";
import { COLORS, COUNTS, DEFAULT_BORDER, FILLS, INVALID_BORDER, SELECTED_BORDER, SHAPES, VALID_BORDER, WIN_STATE } from "./constants.js";
import { Stopwatch } from "./stopwatch.js";
import { CardResponse, changeBorder, createCardDTOsFromSelected, createCardImage, getName, resetBorder, sleep } from "./utilities.js";

export class MultiplayerGame {
    winStatus: boolean;
    validSet: boolean;
    selectedCards: SelectedCards;
    board: Card [];
    players: string [];
    gameID: string;
    gameText: string;
    stopWatch?: Stopwatch;
    gameTime?: string;
    playerName: string;
    client: MultiplayerClient;
    setHistory: string [] [];
    
    constructor() {
        this.client = new MultiplayerClient();
        this.winStatus = false;
        this.validSet = false;
        this.selectedCards = new SelectedCards();
        this.players = [];
        this.board = [];
        this.gameID = "";
        this.gameText = "";
        this.setHistory = [];
        this.playerName = "";
        document.getElementById("startMultiplayerGameButton")!.addEventListener('click', this.startGame); 
    }

    async initialize() {
        this.client.handleGameStarted(this.handleGameStarted);
        this.client.handlePlayerJoined(this.handlePlayerJoined);
        this.client.handleBadGuess(this.handleBadGuess);
        this.client.handleSetGuessed(this.handleGuess);
        await this.client.initialize();
    }

    async createGame() {
        await this.initialize();
        const name = getName("Enter a user name:")
        this.playerName = name;
        this.gameID = await this.client.createGame(name);
        this.renderGame();
    }

    startGame = async () => {
        await this.client.startGame(this.gameID);
    }

    async joinGame() {
        await this.initialize();
        const name = getName("Enter a user name:")
        const gameId = getName("Enter the id of the game to join:")
        this.playerName = name;
        this.gameID = gameId;
        await this.client.joinGame(gameId, name);
        this.renderGame();
    }

    handleGameStarted = (gameStarted: { board: CardResponse[] }) => {
        this.updateBoard(gameStarted.board);
        this.renderGame();
    }

    handlePlayerJoined = (gameStarted: { playerName: string }) => {
        this.players.push(gameStarted.playerName);
    }

    handleBadGuess = async () => {
        const guessedCards=  [...this.selectedCards.getSelectedCards()]
        changeBorder(this.board, guessedCards, INVALID_BORDER);
        this.renderGame();
        await sleep(600);
        resetBorder(this.board);
        this.selectedCards.reset();
        this.renderGame();
    }

    handleGuess = async (setGuessed: SetGuessed) => {
        if(setGuessed.playerName === this.playerName) {
            const guessedCards = [...this.selectedCards.getSelectedCards()]
            changeBorder(this.board, guessedCards, VALID_BORDER);
            this.setHistory.push([guessedCards[0], guessedCards[1], guessedCards[2]]);
            this.renderGame();
        }
        await sleep(600);
        this.updateBoard(setGuessed.board);
        if (setGuessed.winState) {
            await this.enterWinState();
        }
        else {
            resetBorder(this.board);
            this.gameText = "Cards Remaining:" + setGuessed.board.length
        }
        this.selectedCards.reset();
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
        const board = document.getElementById('board')!;
        board.innerHTML = "";
        for (const cardObj of this.board) {
            const newCard = createCardImage(cardObj.count, cardObj.fill, cardObj.color, cardObj.shape, cardObj.cardBorder);
            newCard.addEventListener("click", this.markCard.bind(this));
            board.appendChild(newCard);
        }

        if (this.winStatus) {
            const time = document.getElementById("time")!;
            time.innerText = this.gameTime!;
        }

        document.getElementById("deckCount")!.innerText = this.gameText;
        document.getElementById('subheader')!.textContent = `Game ID: ${this.gameID}`;

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
        await this.client.makeGuess(guess);
    }

    async enterWinState() {
        this.stopWatch!.stop();
        this.winStatus = true;
        this.gameText = "No more sets present!";
        for (const card of this.board) {
            changeBorder(this.board, [`${card.count},${card.fill},${card.color},${card.shape}`], WIN_STATE);
        }
        this.renderGame();
    }
}