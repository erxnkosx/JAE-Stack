import express from "express";
import {pageInfo} from "../types";
export function ontdekRouter() {
    const router = express.Router();

    router.get("/", (req, res) => {
        const info: pageInfo = {
            currentPage: "ontdek"
        }
        res.render("ontdek", { info });
    });

    return router;
}