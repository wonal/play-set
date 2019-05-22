import {
    COUNT1,
    COUNT2,
    FILL1,
    FILL2,
    COLOR1,
    COLOR2,
    SHAPE1,
    SHAPE2,
    DEFAULT_BORDER,
} from './constants.js'

export function changeBorder(board, cardIDs, borderColor) {
    const length = cardIDs.length;
    let numChanged = 0;
    for (const card of board) {
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

export function resetBorder(board) {
    for (const card of board) {
        card.cardBorder = DEFAULT_BORDER;
    }
}

export function createCardImage(count, fill, color, shape, border) {
    const cardValue = `${count},${fill},${color},${shape}`;
    const cardImage = document.createElement("img");
    cardImage.src = `/images/${cardValue}.png`;
    cardImage.alt = cardValue;
    cardImage.id = cardValue;
    cardImage.className = border;
    return cardImage;
}

export function createCardDTOsFromSelected(selected) {
    const cards = [];
    for (let j = 0; j < 3; j++) {
        const card = selected[j].split(",");
        const selectedCard = {
            Count: attributeToOption(card[0], COUNT1, COUNT2),
            Fill: attributeToOption(card[1], FILL1, FILL2),
            Color: attributeToOption(card[2], COLOR1, COLOR2),
            Shape: attributeToOption(card[3], SHAPE1, SHAPE2)
        };
        cards.push(selectedCard);
    }
    return cards;
}

export function attributeToOption(attribute, option1Equivalent, option2Equivalent) {
    if (attribute.toLowerCase() === option1Equivalent) {
        return "Option1";
    }
    else if (attribute.toLowerCase() === option2Equivalent) {
        return "Option2";
    }
    else {
        return "Option3";
    }
}

export function formatTime(ms) {
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / (1000 * 60)) % 60;
    const hours = Math.floor(ms / (1000 * 60 * 60)) % 60;

    return "Time: " + (hours < 10 ? "0" + hours : hours) +
        "h:" + (minutes < 10 ? "0" + minutes : minutes) +
        "m:" + (seconds < 10 ? "0" + seconds : seconds) + "s";
}

export function sleep(time) {
    const promise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, time);
    });
    return promise;
}

export function getName() {
    let name = window.prompt("You found all sets! Enter in your name here: ");
    if (name === null || name === "") {
        name = "Anonymous";
    }
    return name.length > 20 ? name.substring(0, 20) : name;
}
