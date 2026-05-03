import express from "express";
import {User} from "../types"
import { login, register } from "../database";
import { redirectIfLoggedIn } from "../middleware/secureMiddleware";

export function authRouter() {
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
    
    router.post("/signup", async (req, res) => {
        const email: string = req.body.email;
        const password: string = req.body.password;

        try {

            let user: User = await register(email, password);

            delete user.password;
            req.session.user = user;
            req.session.message = { type: "success", message: "Registratie succesvol" };
            res.redirect("/");
        } catch (e: any) {
            req.session.message = { type: "error", message: e.message };
            res.redirect("/signup");
        }
        });

        router.post("/logout", (req, res) => {
        req.session.destroy(() => {
            res.redirect("/login");
        });
    });
    return router;
}