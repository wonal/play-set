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
    SelectedCards,
    GameStatus
} from './constants.js'

const selected = new SelectedCards();
const gameStatus = new GameStatus();

function initializeBoard() {
    addStartingCards();
    const deckCount = document.createElement("div");
    deckCount.id = "deckCount";
    deckCount.className = "deckCount";
    deckCount.innerText = CARDS_REMAINING;
    document.body.appendChild(document.createElement("br"));
    document.body.appendChild(deckCount);
    document.body.appendChild(document.createElement("br"));
    addResetButton();
};

async function addStartingCards() {
    const response = await fetch(`${URL}/initgame`);
    const data = await response.json();
    renderBoard(data.cards, false);
    gameStatus.setGameID(data.gameID);
}

function renderBoard(cards, gameWon) {
    const oldCards = document.querySelectorAll('img');
    const board = document.getElementById('board');
    for (const card of oldCards) {
        board.removeChild(card);
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

function addResetButton() {
    const button = document.createElement("button");
    button.type = "button";
    button.innerText = "New Game";
    document.body.appendChild(button);
    button.addEventListener("click", resetGame)
}

async function resetGame() {
    const id = gameStatus.getGameID();
    const response = await fetch(`${URL}/newgame/${id}`);
    const data = await response.json();
    renderBoard(data.cards, false);
    gameStatus.updateStatus(false);
    document.getElementById("deckCount").innerText = CARDS_REMAINING;
}

function mark(e) {
    if (gameStatus.gameWon) {
        return;
    }

    if (selected.hasCard(e.currentTarget)) {
        e.currentTarget.className = DEFAULT_BORDER;
        selected.removeCard(e.currentTarget);
    } else {
        e.currentTarget.className = SELECTED_BORDER;
        selected.addCard(e.currentTarget);
        if (selected.getCount() == 3) {
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
    const selectedImages = selected.getSelectedCards();
    const selectedCards = createCards(selectedImages);
    const id = gameStatus.getGameID();

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
            gameStatus.updateStatus(true);
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
    selected.reset();
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
    const selectedCards = selected.getSelectedCards();
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

(function () {
    initializeBoard();
})()