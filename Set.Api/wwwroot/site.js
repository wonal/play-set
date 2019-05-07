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

const gameState = new SelectedCards();

function initializeBoard() {
    addStartingCards();
};

async function addStartingCards() {
    const response = await fetch(`${URL}/initgame`);
    const data = await response.json();
    renderBoard(data.cards, false);
    gameState.setGameID(data.gameID);
}

function renderBoard(cards, gameWon) {
    const board = document.getElementById('board');
    const numNodes = board.childNodes.length;
    for (let i = 0; i < numNodes; i++) {
        board.removeChild(board.childNodes[0]);
    }
    for (const card of cards) {
        const newCard = createCard(COUNTS[card.count], FILLS[card.fill], COLORS[card.color], SHAPES[card.shape]);
        if (gameWon) {
            newCard.className = WIN_STATE;
        }
        board.appendChild(newCard);
    }
}

function createCard(count, fill, color, shape) {
    const imgurl = "/images/";
    const cardValue = `${count},${fill},${color},${shape}`;
    const cardImage = document.createElement("img");
    cardImage.src = `${imgurl}${cardValue}.png`;
    cardImage.alt = cardValue;
    cardImage.id = cardValue;
    cardImage.className = DEFAULT_BORDER;
    cardImage.addEventListener("click", mark);
    return cardImage;
}

async function resetGame() {
    const id = gameState.getGameID();
    const response = await fetch(`${URL}/newgame/${id}`);
    const data = await response.json();
    renderBoard(data.cards, false);
    gameState.updateStatus(false);
    document.getElementById("deckCount").innerText = CARDS_REMAINING;
}

function mark(e) {
    if (gameState.gameWon) {
        return;
    }

    if (gameState.hasCard(e.currentTarget)) {
        e.currentTarget.className = DEFAULT_BORDER;
        gameState.removeCard(e.currentTarget);
    } else {
        e.currentTarget.className = SELECTED_BORDER;
        gameState.addCard(e.currentTarget);
        if (gameState.getCount() == 3) {
            checkCards();
        }
    }
}

function createCards(selectedImages) {
    const selectedCards = [];
    for (let j = 0; j < 3; j++) {
        const card = selectedImages[j].alt.split(",");
        const selectedCard = {
            Count: attributeToOption(card[0], "one", "three"),
            Fill: attributeToOption(card[1], "solid", "hollow"),
            Color: attributeToOption(card[2], "red", "purple"),
            Shape: attributeToOption(card[3], "circle", "diamond")
        };
        selectedCards.push(selectedCard);
    }
    return selectedCards;
}

async function checkCards() {
    const selectedImages = gameState.getSelectedCards();
    const selectedCards = createCards(selectedImages);
    const id = gameState.getGameID();

    const fetchData = {
        method: 'POST',
        body: JSON.stringify({ GameID: id, Card1: selectedCards[0], Card2: selectedCards[1], Card3: selectedCards[2]}),
        headers: new Headers({
            'Content-Type': 'application/json',
            'Accept-Encoding': 'application/json'
        })
    };
    const response = await fetch(`${URL}/validate`, fetchData);
    const body = await response.json();
    if (body.validSet) {
        await sleep(100);
        changeSelectedBorder(VALID_BORDER);
        await sleep(1000);
        if (body.winState) {
            gameState.updateStatus(true);
            renderBoard(body.board, true);
            document.getElementById("deckCount").innerText = "No more sets present!";
        }
        else {
            changeSelectedBorder(DEFAULT_BORDER);
            renderBoard(body.board, false);
            document.getElementById("deckCount").innerText = "Cards remaining:" + body.cardsRemaining;
        }
    }
    else {
        await sleep(100);
        changeSelectedBorder(INVALID_BORDER);
        await sleep(1000);
        changeSelectedBorder(DEFAULT_BORDER);
    }
    gameState.reset();
}

function sleep(time) {
    const promise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, time);
    });
    return promise;
}


function changeSelectedBorder(toColor) {
    const selectedCards = gameState.getSelectedCards();
    for (const card of selectedCards) {
        card.className = toColor;
    }
}

function attributeToOption(attribute, option1Equivalent, option2Equivalent) {
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
    initializeBoard();
    trigger.addEventListener("click", toggleModal);
    closeButton.addEventListener("click", toggleModal);
    window.addEventListener("click", windowOnClick);
    const button = document.getElementById("resetButton");
    button.addEventListener("click", resetGame);
})()