"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = homeRouter;
const express_1 = __importDefault(require("express"));
function homeRouter() {
    const router = express_1.default.Router();
    router.get("/", (req, res) => {
        res.render("index", { user: req.session.user || null });
    });
    router.get("/check-login", (req, res) => {
        if (!req.session.user) {
            req.session.message = { type: "error", message: "Gelieve eerst in te loggen" };
            res.redirect("/");
        }
        else {
            res.redirect("/ontdek");
        }
    });
    return router;
}
