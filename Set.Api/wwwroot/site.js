import { Game } from './game.js'

const game = new Game();

//logic for modal box taken from: https://sabe.io/tutorials/how-to-create-modal-popup-box
const modal = document.querySelector(".modal");
const trigger = document.querySelector(".trigger");
const closeButton = document.querySelector(".close-button");

function toggleModal() {
    modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}

function passWeeklyScore(event) {
    displayScoreTab(event.currentTarget, 'weeklyscore');
}

function passTopScore(event) {
    displayScoreTab(event.currentTarget, 'topscore');
}

//logic for tabs taken from: https://www.w3schools.com/howto/howto_js_tabs.asp
function displayScoreTab(element, tab) {
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tab).style.display = "block";
    if (element) {
        element.className += " active";
    }
}

(function () {
    trigger.addEventListener("click", toggleModal);
    closeButton.addEventListener("click", toggleModal);
    window.addEventListener("click", windowOnClick);

    const timeGameButton = document.getElementById("resetButton");
    timeGameButton.addEventListener("click", game.createNewGame.bind(game));
    const seedGameButton = document.getElementById("seedButton");
    seedGameButton.addEventListener("click", game.createSeedGame.bind(game));

    const topScores = document.getElementById("topbutton");
    topScores.addEventListener("click", passTopScore);
    const weeklyScores = document.getElementById("weeklybutton");
    displayScoreTab(weeklyScores, 'weeklyscore');
    weeklyScores.addEventListener("click", passWeeklyScore);
})()
