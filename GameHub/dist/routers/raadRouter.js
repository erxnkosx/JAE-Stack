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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = raadRouter;
const express_1 = __importDefault(require("express"));
const database_1 = require("../database");
const secureMiddleware_1 = require("../middleware/secureMiddleware");
const raadService_1 = require("../services/raadService");
function raadRouter() {
    const router = express_1.default.Router();
    router.get("/", secureMiddleware_1.secureMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const info = {
            currentPage: "raad"
        };
        if (!req.session.guessGame) {
            const games = yield (0, database_1.getGames)();
            const game = games[Math.floor(Math.random() * games.length)];
            const guessGame = { tries: 4, game, guess: "", isGuessable: true };
            req.session.guessGame = guessGame;
        }
        res.render("raad-page", { info, guessGame: req.session.guessGame, user: req.session.user, feedback: null });
    }));
    router.post("/guess", secureMiddleware_1.secureMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const guessGame = req.session.guessGame;
        const user = req.session.user;
        if (!guessGame)
            return res.redirect("/raad-page");
        if (!user)
            throw new Error("No user");
        guessGame.guess = (_a = req.body.guess) !== null && _a !== void 0 ? _a : "";
        const info = { currentPage: "raad" };
        const previousGameName = guessGame.game.name;
        const wasCorrect = guessGame.guess.trim().toLowerCase() === previousGameName.trim().toLowerCase();
        yield (0, raadService_1.evaluateGame)(guessGame, req.session.user);
        const feedback = wasCorrect
            ? { type: "success", message: `Goed geraden! Het was "${previousGameName}"` }
            : { type: "error", message: `Fout! Probeer opnieuw.` };
        res.render("raad-page", { info, guessGame, user, feedback });
    }));
    router.get("/restart", secureMiddleware_1.secureMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const guessGame = req.session.guessGame;
        const user = req.session.user;
        if (!guessGame)
            return res.redirect("/raad-page");
        if (!user)
            throw new Error("No user");
        yield (0, raadService_1.restartGame)(guessGame, user);
        req.session.guessGame = guessGame;
        req.session.save(() => {
            res.redirect("/raad-page");
        });
    }));
    return router;
}
