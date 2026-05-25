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
exports.default = apiRouter;
const express_1 = __importDefault(require("express"));
function apiRouter() {
    const router = express_1.default.Router();
    router.get("/api/suggestions", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const q = req.query.q;
        const result = yield fetch(`https://api.rawg.io/api/games?key=${process.env.API_KEY}&search=${encodeURIComponent(q)}&page_size=6`);
        const response = yield result.json();
        const filtered = response.results.filter(g => g.name.toLowerCase().includes(q.toLowerCase()));
        return res.json(filtered);
    }));
    return router;
}
