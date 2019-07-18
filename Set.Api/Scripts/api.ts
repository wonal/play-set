import { URL } from './constants.js'
import { Scores, CardResponse, CardType} from './utilities.js'

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

export interface GameState{
    gameID: string,
    board: CardResponse [],
    winState: boolean
    validSet: boolean,
    cardsRemaining: number,
    topScores: Scores [],
}

export interface Guess{
    GameID: string,
    Card1: CardType,
    Card2: CardType,
    Card3: CardType
}

export interface Winner{
    gameID: string,
    playerName: string
}

export interface WinState{
    gameID: string,
    playerName: string,
    gameTime: number,
    topScores: Scores [],
    weeklyScores: Scores []
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

export async function postGuess(guess: Guess){
        const fetchData = {
            method: 'POST',
            body: JSON.stringify(guess),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept-Encoding': 'application/json'
            })
        };
        const response = await fetch(`${URL}/submitguess`, fetchData);
        return <GameState> (await response.json());
}

export async function postWin(winner: Winner){
        const fetchData = {
            method: 'POST',
            body: JSON.stringify(winner),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept-Encoding': 'application/json'
            })
        };
        const response = await fetch(`${URL}/postwin`, fetchData);
        return <WinState> (await response.json());
}