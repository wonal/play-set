const url = "https://localhost:44351/api/set";

function checkCards() {
    const firstCard = {
        Color: colorToOption($("#color").val()),
        Shape: shapeToOption($("#shape").val()),
        Fill: fillToOption($("#fill").val()),
        Count: countToOption($("#count").val())
    };
    const secondCard = {
        Color: colorToOption($("#color2").val()),
        Shape: shapeToOption($("#shape2").val()),
        Fill: fillToOption($("#fill2").val()),
        Count: countToOption($("#count2").val())
    };
    const thirdCard = {
        Color: colorToOption($("#color3").val()),
        Shape: shapeToOption($("#shape3").val()),
        Fill: fillToOption($("#fill3").val()),
        Count: countToOption($("#count3").val())
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
        .then(body => alert(body));
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
