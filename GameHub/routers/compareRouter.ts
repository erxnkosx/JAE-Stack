import express from "express";
import {pageInfo} from "../types";

export function compareRouter() {
    const router = express.Router();

    router.get("/", (req, res) => {
        const info: pageInfo = {
            currentPage: "vergelijk"
        }
        res.render("compare", { info });
    });

    return router;
}