const url = "https://localhost:44351/api/set";
const colors = ["red", "blue", "yellow"];
const shapes = ["circle", "triangle", "square"];
const fills = ["solid", "hollow", "striped"];
const counts = ["one", "two", "three"];

function createForm() {
    const cardForm = document.createElement("form");
    addStartingCards(cardForm);
    addButton(cardForm, "check", "Check", checkCards);
    //addButton(cardForm, "refill", "Get Cards", retrieveNewCards);
    document.body.appendChild(cardForm);
};

function addStartingCards(form) {
    fetch(url+"/12")
        .then(response => response.json())
        .then(function (data) {
            for (let i = 0; i < 12; i++) {
                const br = document.createElement("br");
                form.appendChild(br);
                const card = document.createElement("input");
                card.type = "checkbox";
                card.className = "cardAttributes"
                card.id = "card" + (i + 1);
                const cardValue = counts[data[i].count] + "," + fills[data[i].fill] + "," + colors[data[i].color] + "," + shapes[data[i].shape];
                card.value = cardValue;
                card.name = "cardCheckbox";
                form.appendChild(card);
                const span = document.createElement("span");
                span.innerHTML = cardValue;
                form.append(span);
            }
        })
}

function addButton(form, buttonID, buttonValue, buttonFunc) {
    const button = document.createElement("button");
    button.id = buttonID;
    button.type = "button";
    button.innerHTML = buttonValue;
    form.appendChild(button);
    button.addEventListener("click", buttonFunc);
}

function retrieveNewCards() {
    document.getElementById("result").value = "";
    fetch(url+"/3")
        .then(response => response.json())
        .then(function (data) {
            for (let i = 0; i < 3; i++) {
                document.getElementById("color" + (i + 1)).value = colors[data[i].color];
                document.getElementById("shape" + (i + 1)).value = shapes[data[i].shape];
                document.getElementById("fill" + (i + 1)).value = fills[data[i].fill];
                document.getElementById("count" + (i + 1)).value = counts[data[i].count];
            }
        })
}

function checkCards() {
    const selected1 = document.querySelectorAll('input[name=cardCheckbox]:checked');
    const selected = findSelected() 
    const card1 = selected[0].value.split(",");
    const firstCard = {
        Color: colorToOption(card1[2]),
        Shape: shapeToOption(card1[3]),
        Fill: fillToOption(card1[1]),
        Count: countToOption(card1[0])
    };
    const card2 = selected[1].value.split(",");
    const secondCard = {
        Color: colorToOption(card2[2]),
        Shape: shapeToOption(card2[3]),
        Fill: fillToOption(card2[1]),
        Count: countToOption(card2[0])
    };
    const card3 = selected[2].value.split(",");
    const thirdCard = {
        Color: colorToOption(card3[2]),
        Shape: shapeToOption(card3[3]),
        Fill: fillToOption(card3[1]),
        Count: countToOption(card3[0])
    };

    const cards = [firstCard, secondCard, thirdCard];

    let fetchData = {
        method: 'POST',
        body: JSON.stringify(cards),
        headers: new Headers({
            'Content-Type': 'application/json',
            'Accept-Encoding': 'application/json'
        })
    };
    fetch(url, fetchData)
        .then(response => response.json())
        .then(body => document.getElementById("result").value = String(body));
}

function findSelected() {
    const cards = document.getElementsByName("cardCheckbox");
    const cardLength = cards.length;
    const selected = [];
    for (let i = 0; i < cardLength; i++) {
        if (cards[i].checked) {
            selected.push(cards[i]);
        }
    }
    return selected;
}

function colorToOption(color) {
    if (color.toLowerCase() === "red") {
        return "Option1"
    }
    else if (color.toLowerCase() === "blue") {
        return "Option2"
    }
    else {
        return "Option3"
    }
}

function shapeToOption(shape) {
    if (shape.toLowerCase() === "circle") {
        return "Option1"
    }
    else if (shape.toLowerCase() === "triangle") {
        return "Option2"
    }
    else {
        return "Option3"
    }
}
function fillToOption(fill) {
    if (fill.toLowerCase() === "solid") {
        return "Option1"
    }
    else if (fill.toLowerCase() === "hollow") {
        return "Option2"
    }
    else {
        return "Option3"
    }
}

function countToOption(count) {
    if (count.toLowerCase() === "one") {
        return "Option1"
    }
    else if (count.toLowerCase() === "two") {
        return "Option2"
    }
    else {
        return "Option3"
    }
}

(function () {
    createForm();
})()