import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";

import { homeRouter } from "./routers/homeRouter";
import { authRouter } from "./routers/authRouter";
import { compareRouter } from "./routers/compareRouter";

dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, "views"));

app.set("port", process.env.PORT || 3000);

app.use("/", homeRouter());
app.use("/", authRouter());
app.use("/compare", compareRouter());

app.listen(app.get("port"), () => {
    console.log("Server started on http://localhost:" + app.get('port'));
});