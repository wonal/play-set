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

(function () {
    trigger.addEventListener("click", toggleModal);
    closeButton.addEventListener("click", toggleModal);
    window.addEventListener("click", windowOnClick);

    const timeGameButton = document.getElementById("resetButton");
    timeGameButton.addEventListener("click", game.createNewGame.bind(game));
    const seedGameButton = document.getElementById("seedButton");
    seedGameButton.addEventListener("click", game.createSeedGame.bind(game));
})()
