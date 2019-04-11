const url = "https://localhost:44351/api/set";
const counts = ["one", "two", "three"];
const fills = ["solid", "hollow", "striped"];
const colors = ["red", "blue", "yellow"];
const shapes = ["circle", "triangle", "square"];
const OPTION1 = "Option1";
const OPTION2 = "Option2";
const OPTION3 = "Option3";

function createForm() {
    addStartingCards();
    addButton("check", "Check", checkCards);
    //addButton(cardForm, "refill", "Get Cards", retrieveNewCards);
    //document.body.appendChild(cardForm);
};

function addStartingCards() {
    const imgurl = "/images/";
    fetch(`${url}/3`)
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < 3; i++) {
                const cardValue = `${counts[data[i].count]},${fills[data[i].fill]},${colors[data[i].color]},${shapes[data[i].shape]}`;
                const cardImage = document.createElement("img");
                const fill = fills[data[i].fill];
                if (fill === "solid") {
                    cardImage.src = imgurl + "solidsix.png";
                }
                else if (fill === "hollow") {
                    cardImage.src = imgurl + "hollowsix.png";
                }
                else {
                    cardImage.src = imgurl + "stripedsix.png";
                }
                cardImage.alt = cardValue;
                //cardImage.style.border = "";
                //cardImage.setAttribute("onclick", "mark(this)");
                cardImage.addEventListener("click", mark);
                document.body.appendChild(cardImage);
            }
        })
}

function mark(e) {
    if (e.currentTarget.style.border == "3px solid red") {
        e.currentTarget.style.border = "";
    } else {
        e.currentTarget.style.border = "3px solid red";
    }
}

function addButton(buttonID, buttonValue, buttonFunc) {
    const button = document.createElement("button");
    button.id = buttonID;
    button.type = "button";
    button.innerHTML = buttonValue;
    document.body.appendChild(button);
    button.addEventListener("click", buttonFunc);
}

function retrieveNewCards() {
    document.getElementById("result").value = "";
    fetch(url+"/3")
        .then(response => response.json())
        .then(function (data) {
            for (let i = 0; i < 3; i++) {
                document.getElementById("count" + (i + 1)).value = counts[data[i].count];
                document.getElementById("fill" + (i + 1)).value = fills[data[i].fill];
                document.getElementById("color" + (i + 1)).value = colors[data[i].color];
                document.getElementById("shape" + (i + 1)).value = shapes[data[i].shape];
            }
        })
}

function getSelectedImages() {
    const images = document.querySelectorAll('img');
    const selectedImages = [];
    for (let i = 0; i < images.length; i++) {
        if (images[i].style.border == "3px solid red") {
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
            Count: attributeToOption(card[0], "one", "two"),
            Fill: attributeToOption(card[1], "solid", "hollow"),
            Color: attributeToOption(card[2], "red", "blue"),
            Shape: attributeToOption(card[3], "circle", "triangle")
        };
        selectedCards.push(selectedCard);
    }
    return selectedCards;
}

function checkCards() {
    const selectedImages = getSelectedImages();
    const selectedCards = createCards(selectedImages);

    let fetchData = {
        method: 'POST',
        body: JSON.stringify(selectedCards),
        headers: new Headers({
            'Content-Type': 'application/json',
            'Accept-Encoding': 'application/json'
        })
    };
    fetch(url, fetchData)
        .then(response => response.json())
        .then(body => document.getElementById("result").value = String(body));
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
    createForm();
})()