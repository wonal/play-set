import { Game } from './game.js'
import { MultiplayerGame } from './multiplayerGame.js';
const game = new Game();
const multiplayerGame = new MultiplayerGame();

//logic for modal box taken from: https://sabe.io/tutorials/how-to-create-modal-popup-box
const modal = document.querySelector(".modal")!;
const trigger = document.querySelector(".trigger")!;
const closeButton = document.querySelector(".close-button")!;

function toggleModal() {
    modal.classList.toggle("show-modal");
}

function windowOnClick(event: MouseEvent) {
    if (event.target === modal) {
        toggleModal();
    }
}

function passDailyScore(event: MouseEvent) {
    displayScoreTab(<HTMLElement>event.currentTarget, 'dailyscore');
}

function passTopScore(event: MouseEvent) {
    displayScoreTab(<HTMLElement>event.currentTarget, 'topscore');
}

async function multiplayerButton(event: MouseEvent) {
    await multiplayerGame.createGame();
}

async function joinMultiplayerButton(event: MouseEvent) {
    await multiplayerGame.joinGame();
}

//logic for tabs taken from: https://www.w3schools.com/howto/howto_js_tabs.asp
function displayScoreTab(element: HTMLElement, tab: string) {
    const tabcontent = document.getElementsByClassName("tabcontent") as HTMLCollectionOf<HTMLDivElement>; 
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tab)!.style.display = "block";
    if (element) {
        element.className += " active";
    }
}

(function () {
    trigger.addEventListener("click", toggleModal);
    closeButton.addEventListener("click", toggleModal);
    window.addEventListener("click", windowOnClick);

    const timeGameButton = document.getElementById("resetButton")!;
    timeGameButton.addEventListener("click", game.createNewGame.bind(game));

    const topScores = document.getElementById("topbutton")!;
    topScores.addEventListener("click", passTopScore);
    const dailyScores = document.getElementById("dailybutton")!;
    displayScoreTab(dailyScores, 'dailyscore');
    dailyScores.addEventListener("click", passDailyScore);

    document.getElementById("multiplayerbutton")!.addEventListener('click', multiplayerButton);
    document.getElementById("joinmultiplayerbutton")!.addEventListener('click', joinMultiplayerButton);
})()
