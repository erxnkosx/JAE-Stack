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
exports.default = compareRouter;
const express_1 = __importDefault(require("express"));
const secureMiddleware_1 = require("../middleware/secureMiddleware");
function compareRouter() {
    const router = express_1.default.Router();
    router.get("/", secureMiddleware_1.secureMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const info = {
            currentPage: "vergelijk"
        };
        const response = yield fetch(`https://api.rawg.io/api/games?key=${process.env.API_KEY}&page_size=40&ordering=-rating`);
        const data = yield response.json();
        res.render("compare", { info, games: data.results });
    }));
    router.get("/api", secureMiddleware_1.secureMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`https://api.rawg.io/api/games?key=${process.env.API_KEY}`);
        const data = yield response.json();
        res.json(data.results);
    }));
    return router;
}
