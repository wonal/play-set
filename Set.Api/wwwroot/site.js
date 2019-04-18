const url = "https://localhost:44351/api/set";
const counts = ["one", "three", "six"];
const fills = ["solid", "hollow", "stacked"];
const colors = ["red", "purple", "yellow"];
const shapes = ["circle", "diamond", "rectangle"];
const OPTION1 = "Option1";
const OPTION2 = "Option2";
const OPTION3 = "Option3";
const DEFAULTBORDER = "card";
const SELECTEDBORDER = "selected";
const INVALIDBORDER = "invalid";
const VALIDBORDER = "valid";

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
const selected = new SelectedCards();

function initializeBoard() {
    addStartingCards();
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
    cardImage.className = "card";
    cardImage.addEventListener("click", mark);
    return cardImage;
}

function mark(e) {
    if (selected.hasCard(e.currentTarget)) {
        e.currentTarget.className = "card";
        selected.removeCard(e.currentTarget);
    } else {
        e.currentTarget.className = "selected";
        selected.addCard(e.currentTarget);
        if (selected.getCount() == 3) {
            checkCards();
        }
    }
}

function getSelectedImages() {
    const images = document.querySelectorAll('img');
    const selectedImages = [];
    for (let i = 0; i < images.length; i++) {
        if (images[i].style.border != DEFAULTBORDER) {
            selectedImages.push(images[i]);
        }
    }
    return selectedImages;
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
    if (body.item1) {
        await sleep(500);
        changeSelectedBorder(VALIDBORDER);
        await sleep(1000);
        changeSelectedBorder(DEFAULTBORDER);
        renderBoard(body.item2);
    }
    else {
        await sleep(500);
        changeSelectedBorder(INVALIDBORDER);
        await sleep(1000);
        changeSelectedBorder(DEFAULTBORDER);
    }
    selected.reset();
    //document.getElementById("result").value = String(body.item1); 
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