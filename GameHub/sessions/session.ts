import dotenv from "dotenv";
import { MONGO_URI } from "../database";
dotenv.config();

import session from "express-session";
import MongoStore from "connect-mongo";
import { User, FlashMessage } from "../types";

const mongoStore = MongoStore.create({
    mongoUrl: MONGO_URI,
    dbName: "sessions",
    collectionName: "gamehub"
});

mongoStore.on("error", (error) => {
    console.error(error);
});

declare module "express-session" {
    export interface SessionData {
        user?: User;
        message?: FlashMessage;
        guessGame?: import("../types").GuessGame;
    }
}

export default session({
    secret: process.env.SESSION_SECRET ?? "my-super-secret-secret",
    store: mongoStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 
    }
});
