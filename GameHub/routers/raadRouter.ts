import express from "express";
import {pageInfo} from "../types";

export function raadRouter() {
    const router = express.Router();

    router.get("/", (req, res) => {
        const info: pageInfo = {
            currentPage: "raad"
        }
        res.render("raad-page", { info });
    });

    return router;
}