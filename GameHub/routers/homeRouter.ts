import express from "express";

export default function homeRouter() {
    const router = express.Router();

    router.get("/", (req, res) => {
        res.render("index", { user: req.session.user || null });
    });

    router.get("/check-login", (req, res) => {
        if (!req.session.user) {
            req.session.message = { type: "error", message: "Gelieve eerst in te loggen" };
            res.redirect("/");
        } else {
            res.redirect("/ontdek");
        }
    });
    return router;
}