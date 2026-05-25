"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const session_1 = __importDefault(require("./sessions/session"));
const homeRouter_1 = __importDefault(require("./routers/homeRouter"));
const authRouter_1 = __importDefault(require("./routers/authRouter"));
const compareRouter_1 = __importDefault(require("./routers/compareRouter"));
const ontdekRouter_1 = __importDefault(require("./routers/ontdekRouter"));
const collectionRouter_1 = __importDefault(require("./routers/collectionRouter"));
const raadRouter_1 = __importDefault(require("./routers/raadRouter"));
const database_1 = require("./database");
const flashMessage_1 = require("./middleware/flashMessage");
const apiRouter_1 = __importDefault(require("./routers/apiRouter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.set("view engine", "ejs");
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(process.cwd(), "public")));
app.set("views", path_1.default.join(process.cwd(), "views"));
app.set("port", process.env.PORT || 3000);
app.use(session_1.default);
app.use(flashMessage_1.flashMiddleware);
app.use("/", (0, homeRouter_1.default)());
app.use("/", (0, authRouter_1.default)());
app.use("/compare", (0, compareRouter_1.default)());
app.use("/ontdek", (0, ontdekRouter_1.default)());
app.use("/collection", (0, collectionRouter_1.default)());
app.use("/raad-page", (0, raadRouter_1.default)());
app.use((0, apiRouter_1.default)());
app.listen(app.get("port"), () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, database_1.connect)();
        console.log("Server started on http://localhost:" + app.get("port"));
    }
    catch (e) {
        console.log(e);
        process.exit(1);
    }
}));
