import express from "express";
import { PageInfo } from "../types";

export function compareRouter() {
    const router = express.Router();

    router.get("/", (req, res) => {
        const info: PageInfo = {
            currentPage: "vergelijk"
        }
        res.render("compare", { info });
    });

    return router;
}