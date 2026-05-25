import express from "express";
import {User} from "../types"
import { login, register, changePassword, deleteUser, updateAvatar } from "../database";
import { redirectIfLoggedIn, secureMiddleware } from "../middleware/secureMiddleware";
import multer from "multer";

const upload = multer({ dest: "public/images/uploads/" });

export default function authRouter() {
    const router = express.Router();

    router.get("/login", redirectIfLoggedIn, (req, res) => {
        res.render("login");
    });

    router.post("/login", async(req, res) => {
        const email : string = req.body.email;
        const password : string = req.body.password;
        try {
            let user : User = await login(email, password);
            delete user.password;
            req.session.user = user;
            req.session.message = {type: "success", message: "Login succesvol"};
            res.redirect("/")
        } catch (e : any) {
            req.session.message = {type: "error", message: e.message};
            res.redirect("/login");
        }
    });

    router.get("/signup",redirectIfLoggedIn, (req, res) => {
        res.render("signup");
    });

    router.post("/signup", upload.single("avatar"), async (req, res) => {
        const email: string = req.body.email;
        const password: string = req.body.password;
        const avatar: string = req.file ? "/images/uploads/" + req.file.filename : "";

        try {
            let user: User = await register(email, password, avatar);

            delete user.password;
            req.session.user = user;
            req.session.message = { type: "success", message: "Registratie succesvol" };
            res.redirect("/");
        } catch (e: any) {
            req.session.message = { type: "error", message: e.message };
            res.redirect("/signup");
        }
    });

    router.get("/account", secureMiddleware, (req, res) => {
        res.render("account", { info: { currentPage: "" } });
    });

    router.post("/account/password", secureMiddleware, async (req, res) => {
        const currentPassword: string = req.body.currentPassword;
        const newPassword: string = req.body.newPassword;
        try {
            await changePassword(String(req.session.user!._id), currentPassword, newPassword);
            req.session.message = { type: "success", message: "Wachtwoord aangepast" };
        } catch (e: any) {
            req.session.message = { type: "error", message: e.message };
        }
        res.redirect("/account");
    });

    router.post("/account/avatar", secureMiddleware, upload.single("avatar"), async (req, res) => {
        if (!req.file) {
            req.session.message = { type: "error", message: "Geen bestand geüpload" };
            return res.redirect("/account");
        }
        const avatar: string = "/images/uploads/" + req.file.filename;
        try {
            await updateAvatar(String(req.session.user!._id), avatar);
            req.session.user!.avatar = avatar;
            req.session.message = { type: "success", message: "Profielfoto bijgewerkt" };
        } catch (e: any) {
            req.session.message = { type: "error", message: e.message };
        }
        req.session.save(() => res.redirect("/account"));
    });

    router.post("/account/delete", secureMiddleware, async (req, res) => {
        try {
            await deleteUser(String(req.session.user!._id));
            req.session.destroy(() => {
                res.redirect("/");
            });
        } catch (e: any) {
            req.session.message = { type: "error", message: e.message };
            res.redirect("/account");
        }
    });

    router.post("/logout",secureMiddleware, (req, res) => {
        req.session.destroy(() => {
            res.redirect("/");
        });
    });
    return router;
}