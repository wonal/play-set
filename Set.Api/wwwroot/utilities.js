
export function attributeToOption(attribute, option1Equivalent, option2Equivalent) {
    if (attribute.toLowerCase() === option1Equivalent) {
        return "Option1";
    }
    else if (attribute.toLowerCase() === option2Equivalent) {
        return "Option2";
    }
    else {
        return "Option3";
    }
}

export function formatTime(ms) {
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / (1000 * 60)) % 60;
    const hours = Math.floor(ms / (1000 * 60 * 60)) % 60;

    return "Time: " + (hours < 10 ? "0" + hours : hours) +
        "h:" + (minutes < 10 ? "0" + minutes : minutes) +
        "m:" + (seconds < 10 ? "0" + seconds : seconds) + "s";
}

export function sleep(time) {
    const promise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, time);
    });
    return promise;
}

export function getName() {
    let name = window.prompt("You found all sets! Enter in your name here: ");
    if (name === null || name === "") {
        name = "Anonymous";
    }
    return name.length > 20 ? name.substring(0, 20) : name;
}
