import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import session from "./sessions/session"; 
import  homeRouter  from "./routers/homeRouter";
import  authRouter  from "./routers/authRouter";
import compareRouter  from "./routers/compareRouter";
import ontdekRouter from "./routers/ontdekRouter";
import  collectionRouter  from "./routers/collectionRouter";
import  raadRouter  from "./routers/raadRouter";
import {connect} from "./database";
import  {flashMiddleware}  from "./middleware/flashMessage";
import apiRouter from "./routers/apiRouter";


dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "public")));
app.set("views", path.join(process.cwd(), "views"));

app.set("port", process.env.PORT || 3000);

app.use(session);
app.use(flashMiddleware);

app.use("/", homeRouter());
app.use("/", authRouter());
app.use("/compare", compareRouter());
app.use("/ontdek", ontdekRouter());
app.use("/collection", collectionRouter());
app.use("/raad-page", raadRouter());
app.use(apiRouter());

app.listen(app.get("port"), async () => {
    try {
        await connect();
        console.log("Server started on http://localhost:" + app.get("port"));
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
});