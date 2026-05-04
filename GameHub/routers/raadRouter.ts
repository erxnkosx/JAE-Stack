import express from "express";
import {Game, GuessGame, PageInfo, User} from "../types";
import {getGames} from "../database";
import {secureMiddleware} from "../middleware/secureMiddleware";
import {evaluateGame, restartGame} from "../services/raadService";

export function raadRouter() {
    const router = express.Router();

    router.get("/", secureMiddleware, async (req, res) => {
        const info: PageInfo = {
            currentPage: "raad"
        }

        if (!req.session.guessGame) {
            const games: Game[] = await getGames();
            const game = games[Math.floor(Math.random() * games.length)];
            const guessGame: GuessGame = { tries: 4, game, guess: "", isGuessable: true };
            req.session.guessGame = guessGame;
        }

        res.render("raad-page", { info, guessGame: req.session.guessGame, user: req.session.user });
    });

    router.post("/guess", secureMiddleware, async (req, res) => {
        const guessGame: GuessGame | undefined = req.session.guessGame;
        const user: User | undefined = req.session.user;
        if (!guessGame) throw new Error("No game object 1")
        if (!user) throw new Error("No user");

        guessGame.guess = req.body.guess as string ?? "";
        const info: PageInfo = { currentPage: "raad" }

        await evaluateGame(guessGame, req.session.user!);

        res.render("raad-page", { info, guessGame, user });
    });

    router.get("/restart", secureMiddleware, async (req, res) => {
        const guessGame: GuessGame | undefined = req.session.guessGame;
        const user: User | undefined = req.session.user;
        if (!guessGame) throw new Error("No game object 1")
        if (!user) throw new Error("No user");

        await restartGame(guessGame, user);
        res.redirect("/raad-page");
    })

    return router;
}