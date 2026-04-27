import {Game, GuessGame, User} from "../types";
import {getGames} from "../database";

function checkGuess(guess: string, answer: string) {
    return guess.trim().toLowerCase() === answer.trim().toLowerCase()
}

function progressionNegativeHandler(user: User) {
    if (user.progression.level === 1 && user.progression.experience <= 0) return;

    if (user.progression.experience === 0) {
        user.progression.level -= 1;
    } else {
        user.progression.experience -= 1;
    }
}

async function getRandomGame() {
    const games: Game[] = await getGames();
    return games[Math.floor(Math.random() * games.length)];
}


async function newGame(guessGame: GuessGame) {
    guessGame.tries = 4;
    guessGame.isGuessable = true;
    guessGame.guess = "";
    guessGame.game = await getRandomGame();
    console.log(guessGame.game.name)
}

export async function restartGame(guessGame: GuessGame, user: User) {
    guessGame.isGuessable = true;
    progressionNegativeHandler(user)
    await newGame(guessGame);
}

async function wrongHandler(guessGame: GuessGame, user: User) {
    if (guessGame.tries === 0) {
        progressionNegativeHandler(user);
        guessGame.isGuessable = false;
    }

}

function progressionPositiveHandler(user: User) {
    user.progression.experience++;
    if (user.progression.experience === 2) {
        user.progression.level++;
        user.progression.experience = 0;
    }
}

async function correctHandler(game: GuessGame, user: User) {
    progressionPositiveHandler(user);
    await newGame(game);
}

export async function evaluateGame(guessGame: GuessGame, user: User) {
    console.log(guessGame.game.name);
    console.log("tries:" ,guessGame.tries);
    console.log("before: user: ", user.progression);
    const isCorrect: boolean = checkGuess(guessGame.guess, guessGame.game.name);
    if (isCorrect) {
        await correctHandler(guessGame, user);
    }
    else {
        guessGame.tries--;
        await wrongHandler(guessGame, user);
    }

    console.log("after: user: ", user.progression);


}