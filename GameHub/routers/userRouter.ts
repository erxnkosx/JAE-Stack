import { Router } from "express";

export function userRouter() {
    const router = Router();

    router.get("/", async(req, res) => {
        res.render("user");
    });
    return router;
}