"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("../database");
dotenv_1.default.config();
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const mongoStore = connect_mongo_1.default.create({
    mongoUrl: database_1.MONGO_URI,
    dbName: "sessions",
    collectionName: "gamehub"
});
mongoStore.on("error", (error) => {
    console.error(error);
});
exports.default = (0, express_session_1.default)({
    secret: (_a = process.env.SESSION_SECRET) !== null && _a !== void 0 ? _a : "my-super-secret-secret",
    store: mongoStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
});
