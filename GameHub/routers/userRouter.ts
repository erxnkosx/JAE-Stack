import express from "express";

export default function userRouter() {
    const router = express.Router();

    router.get("/", async (req, res) => {
        res.render("user");
    });

    return router;
}