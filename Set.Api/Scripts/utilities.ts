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

export interface CardImage {
    count: string,
    fill: string,
    color: string,
    shape: string,
    cardBorder: string
}

export interface CardType {
    Count: number,
    Fill: number,
    Color: number,
    Shape: number,
}

export interface CardResponse {
    count: number,
    fill: number,
    color: number,
    shape: number
}

export interface Scores {
    name: string,
    time: number
}

export function changeBorder(board: CardImage [], cardIDs: string [], borderColor: string) {
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

export function resetBorder(board: CardImage []) {
    for (const card of board) {
        card.cardBorder = DEFAULT_BORDER;
    }
}

export function createCardImage(count: string, fill: string, color: string, shape: string, border: string, version: number = 0) {
    const cardValue = `${count},${fill},${color},${shape}`;
    const cardImage = document.createElement("img");
    cardImage.src = `/images/${version}/${cardValue}.png`;
    cardImage.alt = cardValue;
    cardImage.id = cardValue;
    cardImage.className = border;
    return cardImage;
}

export function createCardDTOsFromSelected(selected: string []) {
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

export function displayScores(scoreType: string, scores: Scores []) {
    const scoreBoard = document.getElementById(scoreType)!;
    scoreBoard.innerText = "";

    let formattedScores = "\n";
    const actualScores = scores.length;
    for (let i = 0; i < 5; i++) {
        if (i < actualScores) {
            formattedScores += `${i + 1}. ${scores[i].name} -- ${formatTime(scores[i].time)}\n`
        }
        else {
            formattedScores += `${i + 1}.\n`
        }
    }
    scoreBoard.innerText = formattedScores;
}

export function attributeToOption(attribute: string, option1Equivalent: string, option2Equivalent: string) {
    if (attribute.toLowerCase() === option1Equivalent) {
        return 0;
    }
    else if (attribute.toLowerCase() === option2Equivalent) {
        return 1;
    }
    else {
        return 2;
    }
}

export function formatTime(ms: number) {
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / (1000 * 60)) % 60;
    const hours = Math.floor(ms / (1000 * 60 * 60)) % 60;

    return "Time: " + (hours < 10 ? "0" + hours : hours) +
        "h:" + (minutes < 10 ? "0" + minutes : minutes) +
        "m:" + (seconds < 10 ? "0" + seconds : seconds) + "s";
}

export function sleep(time: number) {
    const promise = new Promise<void>(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, time);
    });
    return promise;
}

export function getName(message: string) {
    let name = window.prompt(message);
    if (name === null || name === "") {
        name = "Anonymous";
    }
    return name.length > 20 ? name.substring(0, 20) : name;
}
