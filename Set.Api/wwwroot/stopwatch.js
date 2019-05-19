import { DEFAULT_TIME } from "./constants.js";
import { formatTime } from "./utilities.js";

export class Stopwatch {
    constructor(startTime) {
        this.startTime = startTime;
        this.gameTime = DEFAULT_TIME;
        this.interval = setInterval(this.updateTime.bind(this), 1000);
    }

    updateTime() {
        const time = Date.now();
        const gameDuration = time - this.startTime;
        this.gameTime = formatTime(gameDuration);
        const stopwatch = document.getElementById("time");
        stopwatch.innerText = this.gameTime;
    }

    stop() {
        clearInterval(this.interval);
    }
}