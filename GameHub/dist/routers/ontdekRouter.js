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
exports.default = ontdekRouter;
const express_1 = __importDefault(require("express"));
const secureMiddleware_1 = require("../middleware/secureMiddleware");
const gamesService_1 = require("../services/gamesService");
function ontdekRouter() {
    const router = express_1.default.Router();
    const cachedGames = new Map();
    router.get("/", secureMiddleware_1.secureMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const info = { currentPage: "ontdek" };
        const isSearching = false;
        const page = Number(req.query.page) || 1;
        const pageSize = 12;
        const response = yield fetch(`https://api.rawg.io/api/games?key=${process.env.API_KEY}&page=${page}&page_size=${pageSize}&ordering=-rating`);
        const data = yield response.json();
        const games = yield (0, gamesService_1.getGamesDetail)(data.results);
        res.render("ontdek", {
            info,
            games,
            isSearching,
            currentPage: page,
            hasNextPage: Boolean(data.next),
            hasPreviousPage: Boolean(data.previous)
        });
    }));
    router.get("/suggestions", secureMiddleware_1.secureMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const q = req.query.q;
        const id = req.query.id;
        const info = { currentPage: "ontdek" };
        const isSearching = true;
        const page = 0;
        let games = [];
        if (id) {
            const response = yield fetch(`https://api.rawg.io/api/games/${id}?key=${process.env.API_KEY}`);
            if (response.ok) {
                const game = yield response.json();
                games = [game];
            }
        }
        else {
            if (cachedGames.size !== 0) {
                games = (0, gamesService_1.findQueryInCache)(q, cachedGames);
            }
            if (games.length === 0) {
                games = yield (0, gamesService_1.fetchAllGamesWithQuery)(q);
                (0, gamesService_1.cacheGames)(q, cachedGames, games);
            }
            games = games.filter(g => g.name.toLowerCase().includes(q.toLowerCase()));
            games = yield (0, gamesService_1.getGamesDetail)(games);
        }
        res.render("ontdek", {
            info,
            isSearching,
            games: games,
            currentPage: page,
            hasNextPage: false,
            hasPreviousPage: false
        });
    }));
    router.get("/game/:rawgId", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const id = req.params.rawgId;
        try {
            const response = yield fetch(`https://api.rawg.io/api/games/${id}?key=${process.env.API_KEY}`);
            if (!response.ok) {
                return res.status(404).json({ error: "Game niet gevonden" });
            }
            const gameData = yield response.json();
            const description = gameData.description_raw || "Geen beschrijving beschikbaar.";
            const descriptionShort = description.length > 200 ? description.substring(0, 200) : description;
            res.json(Object.assign(Object.assign({}, gameData), { description_raw: descriptionShort }));
        }
        catch (error) {
            res.status(500).json({ error: "Server fout" });
        }
    }));
    return router;
}
