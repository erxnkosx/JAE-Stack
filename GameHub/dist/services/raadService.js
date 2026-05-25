"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restartGame = restartGame;
exports.evaluateGame = evaluateGame;
const database_1 = require("../database");
function saveUserProgression(user) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!user.email)
            return;
        yield database_1.userCollection.updateOne({ email: user.email }, { $set: { progression: user.progression } });
    });
}
function checkGuess(guess, answer) {
    return guess.trim().toLowerCase() === answer.trim().toLowerCase();
}
function progressionNegativeHandler(user) {
    if (user.progression.level === 1 && user.progression.experience <= 0)
        return;
    if (user.progression.experience === 0) {
        user.progression.level -= 1;
    }
    else {
        user.progression.experience -= 1;
    }
}
function getRandomGame() {
    return __awaiter(this, void 0, void 0, function* () {
        const games = yield (0, database_1.getGames)();
        return games[Math.floor(Math.random() * games.length)];
    });
}
function newGame(guessGame) {
    return __awaiter(this, void 0, void 0, function* () {
        guessGame.tries = 4;
        guessGame.isGuessable = true;
        guessGame.guess = "";
        guessGame.game = yield getRandomGame();
        console.log(guessGame.game.name);
    });
}
function restartGame(guessGame, user) {
    return __awaiter(this, void 0, void 0, function* () {
        guessGame.isGuessable = true;
        progressionNegativeHandler(user);
        yield saveUserProgression(user);
        yield newGame(guessGame);
    });
}
function wrongHandler(guessGame, user) {
    return __awaiter(this, void 0, void 0, function* () {
        if (guessGame.tries <= 0) {
            progressionNegativeHandler(user);
            yield saveUserProgression(user);
            yield newGame(guessGame);
        }
    });
}
function progressionPositiveHandler(user) {
    user.progression.experience++;
    if (user.progression.experience === 2) {
        user.progression.level++;
        user.progression.experience = 0;
    }
}
function correctHandler(game, user) {
    return __awaiter(this, void 0, void 0, function* () {
        progressionPositiveHandler(user);
        yield saveUserProgression(user);
        yield newGame(game);
    });
}
function evaluateGame(guessGame, user) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(guessGame.game.name);
        console.log("tries:", guessGame.tries);
        console.log("before: user: ", user.progression);
        const isCorrect = checkGuess(guessGame.guess, guessGame.game.name);
        if (isCorrect) {
            yield correctHandler(guessGame, user);
        }
        else {
            guessGame.tries--;
            yield wrongHandler(guessGame, user);
        }
        console.log("after: user: ", user.progression);
    });
}
