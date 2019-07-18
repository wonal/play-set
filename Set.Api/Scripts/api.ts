import { URL } from './constants.js'
import { Scores, CardResponse } from './utilities.js'

export interface NewGame{
    gameID: string,
    seedValue: number | null,
    cards: CardResponse [],
    topScores: Scores [],
    weeklyScores: Scores []
}

export interface StartTime{
    startTime: number
}

export async function getNewGame(seedVal: number | null){
    const fetchData = {
        method: 'POST',
        body: JSON.stringify({ seed: seedVal}),
        headers: new Headers({
            'Content-Type': 'application/json',
            'Accept-Encoding': 'application/json'
        })
    };
    const response = await fetch(`${URL}/newgame`, fetchData);
    return <NewGame> await response.json();
}

export async function getStartTime(gameID: string){
    const response = await fetch(`${URL}/markstart/${gameID}`);
    return <StartTime> (await response.json());
}