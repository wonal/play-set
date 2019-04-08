const url = "https://localhost:44351/api/set";
const colors = ["red", "blue", "yellow"];
const shapes = ["circle", "triangle", "square"];
const fills = ["solid", "hollow", "striped"];
const counts = ["one", "two", "three"];

function createForm() {
    const cardForm = document.createElement("form");
    const characteristics = ["color", "shape", "fill", "count"];
    for (let i = 1; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const cardInput = document.createElement("input");
            cardInput.type = "text";
            cardInput.id = characteristics[j] + String(i);
            cardInput.placeholder = "Card " + String(i) + " " + characteristics[j]
            cardForm.appendChild(cardInput);
        }
        const br = document.createElement("br");
        cardForm.appendChild(br);
    }
    addButton(cardForm, "check", "Check", checkCards);
    addButton(cardForm, "refill", "Get Cards", retrieveNewCards);
    /*
    const validateButton = document.createElement("button");
    validateButton.id = "check";
    validateButton.type = "button";
    validateButton.innerHTML = "Check";
    cardForm.appendChild(validateButton);
    validateButton.addEventListener("click", checkCards);
    const refillButton = document.createElement("button");
    refillButton.id = "refill";
    refillButton.type = "button";
    refillButton.innerHTML = "Get Cards";
    cardForm.appendChild(refillButton);
    refillButton.addEventListener("click", retrieveNewCards);
    */
    document.body.appendChild(cardForm);
};

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
    fetch(url)
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
    const firstCard = {
        Color: colorToOption(document.getElementById("color1").value),
        Shape: shapeToOption(document.getElementById("shape1").value),
        Fill: fillToOption(document.getElementById("fill1").value),
        Count: countToOption(document.getElementById("count1").value)
    };
    const secondCard = {
        Color: colorToOption(document.getElementById("color2").value),
        Shape: shapeToOption(document.getElementById("shape2").value),
        Fill: fillToOption(document.getElementById("fill2").value),
        Count: countToOption(document.getElementById("count2").value)
    };
    const thirdCard = {
        Color: colorToOption(document.getElementById("color3").value),
        Shape: shapeToOption(document.getElementById("shape3").value),
        Fill: fillToOption(document.getElementById("fill3").value),
        Count: countToOption(document.getElementById("count3").value)
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