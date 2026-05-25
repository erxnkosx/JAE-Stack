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
exports.default = authRouter;
const express_1 = __importDefault(require("express"));
const database_1 = require("../database");
const secureMiddleware_1 = require("../middleware/secureMiddleware");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ dest: "public/images/uploads/" });
function authRouter() {
    const router = express_1.default.Router();
    router.get("/login", secureMiddleware_1.redirectIfLoggedIn, (req, res) => {
        res.render("login");
    });
    router.post("/login", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const email = req.body.email;
        const password = req.body.password;
        try {
            let user = yield (0, database_1.login)(email, password);
            delete user.password;
            req.session.user = user;
            req.session.message = { type: "success", message: "Login succesvol" };
            res.redirect("/");
        }
        catch (e) {
            req.session.message = { type: "error", message: e.message };
            res.redirect("/login");
        }
    }));
    router.get("/signup", secureMiddleware_1.redirectIfLoggedIn, (req, res) => {
        res.render("signup");
    });
    router.post("/signup", upload.single("avatar"), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const email = req.body.email;
        const password = req.body.password;
        const avatar = req.file ? "/images/uploads/" + req.file.filename : "";
        try {
            let user = yield (0, database_1.register)(email, password, avatar);
            delete user.password;
            req.session.user = user;
            req.session.message = { type: "success", message: "Registratie succesvol" };
            res.redirect("/");
        }
        catch (e) {
            req.session.message = { type: "error", message: e.message };
            res.redirect("/signup");
        }
    }));
    router.get("/account", secureMiddleware_1.secureMiddleware, (req, res) => {
        res.render("account", { info: { currentPage: "" } });
    });
    router.post("/account/password", secureMiddleware_1.secureMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword;
        try {
            yield (0, database_1.changePassword)(String(req.session.user._id), currentPassword, newPassword);
            req.session.message = { type: "success", message: "Wachtwoord aangepast" };
        }
        catch (e) {
            req.session.message = { type: "error", message: e.message };
        }
        res.redirect("/account");
    }));
    router.post("/account/avatar", secureMiddleware_1.secureMiddleware, upload.single("avatar"), (req, res) => __awaiter(this, void 0, void 0, function* () {
        if (!req.file) {
            req.session.message = { type: "error", message: "Geen bestand geüpload" };
            return res.redirect("/account");
        }
        const avatar = "/images/uploads/" + req.file.filename;
        try {
            yield (0, database_1.updateAvatar)(String(req.session.user._id), avatar);
            req.session.user.avatar = avatar;
            req.session.message = { type: "success", message: "Profielfoto bijgewerkt" };
        }
        catch (e) {
            req.session.message = { type: "error", message: e.message };
        }
        req.session.save(() => res.redirect("/account"));
    }));
    router.post("/account/delete", secureMiddleware_1.secureMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, database_1.deleteUser)(String(req.session.user._id));
            req.session.destroy(() => {
                res.redirect("/");
            });
        }
        catch (e) {
            req.session.message = { type: "error", message: e.message };
            res.redirect("/account");
        }
    }));
    router.post("/logout", secureMiddleware_1.secureMiddleware, (req, res) => {
        req.session.destroy(() => {
            res.redirect("/");
        });
    });
    return router;
}
