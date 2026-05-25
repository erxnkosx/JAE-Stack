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
exports.fetchAllGamesWithQuery = fetchAllGamesWithQuery;
exports.cacheGames = cacheGames;
exports.findQueryInCache = findQueryInCache;
exports.getGamesDetail = getGamesDetail;
const TTL = 60 * 5 * 1000;
function fetchAllGamesWithQuery(q) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`https://api.rawg.io/api/games?key=${process.env.API_KEY}&search=${q}&ordering=-rating&page=1`);
        const data = yield response.json();
        return data.results;
    });
}
function cacheGames(query, cachedGames, newGames) {
    cachedGames.set(query.trim().toLowerCase(), { games: newGames, expiresAt: Date.now() + TTL });
}
function findQueryInCache(query, cache) {
    if (cache.size === 0)
        return [];
    const key = query.trim().toLowerCase();
    const entry = cache.get(key);
    if (!entry)
        return [];
    if (Number(entry.expiresAt) < Date.now()) {
        cache.delete(key);
        return [];
    }
    return entry.games;
}
function getGamesDetail(games) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Promise.all(games.map((game) => __awaiter(this, void 0, void 0, function* () {
            const detail = yield fetch(`https://api.rawg.io/api/games/${game.id}?key=${process.env.API_KEY}`);
            const detailData = yield detail.json();
            return Object.assign(Object.assign({}, game), { description_raw: detailData.description_raw || "" });
        })));
    });
}
