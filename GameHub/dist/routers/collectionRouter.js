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
exports.default = collectionRouter;
const express_1 = __importDefault(require("express"));
const database_1 = require("../database");
const secureMiddleware_1 = require("../middleware/secureMiddleware");
function collectionRouter() {
    const router = express_1.default.Router();
    router.get("/", secureMiddleware_1.secureMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const info = { currentPage: "collectie" };
        const userId = String((_a = req.session.user) === null || _a === void 0 ? void 0 : _a._id);
        const collection = yield (0, database_1.getCollection)(userId);
        res.render("collection", { info, collection });
    }));
    router.get("/api", secureMiddleware_1.secureMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const userId = String((_a = req.session.user) === null || _a === void 0 ? void 0 : _a._id);
        const collection = yield (0, database_1.getCollection)(userId);
        res.json(collection);
    }));
    router.post("/api", secureMiddleware_1.secureMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = String((_a = req.session.user) === null || _a === void 0 ? void 0 : _a._id);
            yield (0, database_1.addToCollection)({
                user_id: userId,
                rawg_id: req.body.rawg_id,
                title: req.body.title,
                nickname: req.body.nickname || "",
                status: req.body.status || "backlog",
                background_image: req.body.background_image,
                rating: req.body.rating,
                released: req.body.released,
                description: req.body.description
            });
            res.json({ success: true });
        }
        catch (e) {
            res.status(400).json({ error: e.message });
        }
    }));
    router.put("/api/:rawg_id", secureMiddleware_1.secureMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = String((_a = req.session.user) === null || _a === void 0 ? void 0 : _a._id);
            const rawgId = parseInt(String(req.params.rawg_id));
            yield (0, database_1.updateStatus)(userId, rawgId, req.body.status);
            res.json({ success: true });
        }
        catch (e) {
            res.status(400).json({ error: e.message });
        }
    }));
    router.delete("/api/:rawg_id", secureMiddleware_1.secureMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = String((_a = req.session.user) === null || _a === void 0 ? void 0 : _a._id);
            const rawgId = parseInt(String(req.params.rawg_id));
            yield (0, database_1.removeFromCollection)(userId, rawgId);
            res.json({ success: true });
        }
        catch (e) {
            res.status(400).json({ error: e.message });
        }
    }));
    return router;
}
