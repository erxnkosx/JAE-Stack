import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";

import { homeRouter } from "./routers/homeRouter";
import { authRouter } from "./routers/authRouter";
import { compareRouter } from "./routers/compareRouter";
import { ontdekRouter } from "./routers/ontdekRouter";
import { collectionRouter } from "./routers/collectionRouter";
import { raadRouter } from "./routers/raadRouter";
import {connect} from "./database";


dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, "views"));

app.set("port", process.env.PORT || 3000);

app.use("/index", homeRouter());
app.use("/", ontdekRouter());
app.use("/compare", compareRouter());
app.use("/ontdek", ontdekRouter());
app.use("/collection", collectionRouter());
app.use("/raad-page", raadRouter());


app.listen(app.get("port"), async () => {
    await connect();
    console.log("Server started on http://localhost:" + app.get('port'));
});