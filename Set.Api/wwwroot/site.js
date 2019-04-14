const url = "https://localhost:44351/api/set";
const counts = ["one", "three", "six"];
const fills = ["solid", "hollow", "stacked"];
const colors = ["red", "purple", "yellow"];
const shapes = ["circle", "diamond", "rectangle"];
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
    fetch(`${url}/12`)
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < 12; i++) {
                const count = counts[data[i].count];
                const fill = fills[data[i].fill];
                const color = colors[data[i].color];
                const shape = shapes[data[i].shape];
                createCard(count, fill, color, shape);
            }
        })
}

function createCard(count, fill, color, shape) {
    const imgurl = "/images/";
    const cardValue = `${count},${fill},${color},${shape}`;
    const cardImage = document.createElement("img");
    cardImage.src = imgurl + cardValue + ".png";
    cardImage.alt = cardValue;
    cardImage.style.border = "0.5px solid gray";
    cardImage.addEventListener("click", mark);
    document.body.appendChild(cardImage);
}

function mark(e) {
    if (e.currentTarget.style.border == "3px solid red") {
        e.currentTarget.style.border = "0.5px solid gray";
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
            Count: attributeToOption(card[0], "one", "three"),
            Fill: attributeToOption(card[1], "solid", "hollow"),
            Color: attributeToOption(card[2], "red", "purple"),
            Shape: attributeToOption(card[3], "circle", "diamond")
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
        .then(body => {
            if (body) {
                //selectedImages.forEach((selectedImages) => selectedImages.style.border = "0.5 solid gray");
                for (let i = 0; i < 3; i++) {
                    selectedImages[i].style.border = "0.5px solid gray";
                }
            }
            document.getElementById("result").value = String(body); 
        });
        
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