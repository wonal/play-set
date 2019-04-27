import {
    url,
    counts,
    fills,
    colors,
    shapes,
    OPTION1,
    OPTION2,
    OPTION3,
    DEFAULT_BORDER,
    SELECTED_BORDER,
    INVALID_BORDER,
    VALID_BORDER,
    WIN_STATE
} from './constants.js'

class SelectedCards {
    count = 0;
    selectedCards = [];

    getCount() {
        return this.count;
    }

    hasCard(card) {
        for (let i = 0; i < this.count; i++) {
            if (this.selectedCards[i] === card) {
                return true;
            }
        }
        return false;
    }

    getSelectedCards() {
        return this.selectedCards;
    }

    reset() {
        this.selectedCards = []
        this.count = 0;
    }

    addCard(card) {
        this.selectedCards.push(card);
        this.count += 1;
    }

    removeCard(card) {
        for (let i = 0; i < this.count; i++) {
            if (this.selectedCards[i] === card) {
                this.selectedCards.splice(i, 1);
            }
        }
        this.count -= 1;
    }
}

class WinStatus {
    gameWon = false;

    getStatus() {
        return this.gameWon;
    }

    updateStatus(status) {
        this.gameWon = status;
    }
}

const selected = new SelectedCards();
const winStatus = new WinStatus();

function initializeBoard() {
    addStartingCards();
    const deckCount = document.createElement("div");
    deckCount.id = "deckCount";
    deckCount.innerText = "Cards remaining: 69";
    document.body.appendChild(deckCount);
    addResetButton();
};

async function addStartingCards() {
    const response = await fetch(`${url}/board`);
    const data = await response.json();
    const board = document.getElementById("board");
    for (let i = 0; i < 12; i++) {
        const card = createCard(counts[data[i].count], fills[data[i].fill], colors[data[i].color], shapes[data[i].shape]);
        board.appendChild(card);
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
    button.innerHTML = "New Game";
    document.body.appendChild(button);
    button.addEventListener("click", resetGame)
}

async function resetGame() {
    const response = await fetch(`${url}/newgame`);
    const data = await response.json();
    renderBoard(data);
    winStatus.updateStatus(false);
    document.getElementById("deckCount").innerText = "Cards remaining: 69";
}

function mark(e) {
    if (winStatus.gameWon) {
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

    const fetchData = {
        method: 'POST',
        body: JSON.stringify(selectedCards),
        headers: new Headers({
            'Content-Type': 'application/json',
            'Accept-Encoding': 'application/json'
        })
    };
    const response = await fetch(`${url}/validate`, fetchData);
    const body = await response.json();
    if (body.validSet) {
        await sleep(100);
        changeSelectedBorder(VALID_BORDER);
        await sleep(1000);
        if (body.winState) {
            WinStatus.updateStatus(true);
            changeSelectedBorder(WIN_STATE);
            await sleep(2000);
        }
        changeSelectedBorder(DEFAULT_BORDER);
        renderBoard(body.board);
        document.getElementById("deckCount").innerText = "Cards remaining:" + body.cardsRemaining;
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

function renderBoard(cards) {
    const oldCards = document.querySelectorAll('img');
    const board = document.getElementById('board');
    for (let i = 0; i < oldCards.length; i++) {
        board.removeChild(oldCards[i]);
    }
    for (let j = 0; j < cards.length; j++) {
        const newCard = createCard(counts[cards[j].count], fills[cards[j].fill], colors[cards[j].color], shapes[cards[j].shape]);
        board.appendChild(newCard);
    }
}

function changeSelectedBorder(toColor) {
    const selectedCards = selected.getSelectedCards();
    selectedCards.forEach((image) => image.className = toColor);
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