const url = "https://localhost:44351/api/set";

function createForm() {
    const cardForm = document.createElement("form");
    cardForm.action = "javascript:void(0)";
    cardForm.method = "POST";
    cardForm.onsubmit = checkCards;
    const characteristics = ["color", "shape", "fill", "count"];

    for (i = 1; i < 4; i++) {
        for (j = 0; j < 4; j++) {
            const cardInput = document.createElement("input");
            cardInput.type = "text";
            cardInput.id = characteristics[j] + String(i);
            cardInput.placeholder = "Card " + String(i) + " " + characteristics[j]
            cardForm.appendChild(cardInput);
        }
        const br = document.createElement("BR");
        cardForm.appendChild(br);
    }
    const button = document.createElement("input");
    button.type = "submit";
    button.value = "Check";
    cardForm.appendChild(button);
    document.body.appendChild(cardForm);
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
