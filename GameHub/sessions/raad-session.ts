import session, { MemoryStore } from "express-session";
import {Game, GuessGame, User} from "../types";
import {FlashMessage} from "../types"

declare module "express-session" {
    export interface SessionData {
        guessGame?: GuessGame,
        user?: User,
        message?: FlashMessage;
    }
}

export default session({
    secret: process.env.SESSION_GUESS!,
    store: new MemoryStore(),
    resave: false,
    saveUninitialized: false,
})