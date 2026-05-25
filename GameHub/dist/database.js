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
exports.getGames = exports.connect = exports.userGamesCollection = exports.userCollection = exports.gamesCollection = exports.client = exports.MONGO_URI = void 0;
exports.login = login;
exports.register = register;
exports.seedDatabase = seedDatabase;
exports.getCollection = getCollection;
exports.addToCollection = addToCollection;
exports.updateStatus = updateStatus;
exports.removeFromCollection = removeFromCollection;
exports.changePassword = changePassword;
exports.deleteUser = deleteUser;
exports.updateAvatar = updateAvatar;
const mongodb_1 = require("mongodb");
require("dotenv/config");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.MONGO_URI = process.env.MONGO_URI;
if (!exports.MONGO_URI)
    throw new Error("MONGO_URI is undefined");
const API_KEY = process.env.API_KEY;
if (!API_KEY)
    throw new Error("API_KEY is undefined");
exports.client = new mongodb_1.MongoClient(exports.MONGO_URI);
exports.gamesCollection = exports.client.db("gamehub").collection("games");
exports.userCollection = exports.client.db("gamehub").collection("users");
exports.userGamesCollection = exports.client.db("gamehub").collection("userGames");
const SALT_ROUNDS = 10;
const exit = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.client.close();
        console.log("Disconnected from database");
    }
    catch (error) {
        console.error(error);
    }
    finally {
        process.exit(0);
    }
});
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.client.connect();
        yield seedDatabase();
        console.log("Connected to database");
        process.on("SIGINT", exit);
    }
    catch (error) {
        console.error(error);
    }
});
exports.connect = connect;
const getGames = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield exports.gamesCollection.find({}).toArray();
});
exports.getGames = getGames;
const seed = () => __awaiter(void 0, void 0, void 0, function* () {
    if ((yield exports.gamesCollection.countDocuments()) != 0)
        return;
    let games = [];
    for (let i = 1; i <= 100; i++) {
        const response = yield fetch(`https://api.rawg.io/api/games/${i}?key=${API_KEY}`);
        const game = yield response.json();
        if (game.name) {
            games.push(game);
        }
    }
    yield exports.gamesCollection.insertMany(games);
});
function login(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        if (email === "" || password === "") {
            throw new Error("Email en wachtwoord zijn verplicht");
        }
        let user = yield exports.userCollection.findOne({ email: email });
        if (user) {
            if (yield bcrypt_1.default.compare(password, user.password)) {
                return user;
            }
            else {
                throw new Error("Wachtwoord incorrect");
            }
        }
        else {
            throw new Error("Gebruiker niet gevonden");
        }
    });
}
function register(email, password, avatar) {
    return __awaiter(this, void 0, void 0, function* () {
        if (email === "" || password === "") {
            throw new Error("Email en wachtwoord zijn verplicht");
        }
        const existingUser = yield exports.userCollection.findOne({ email });
        if (existingUser) {
            throw new Error("Gebruiker bestaat al");
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, SALT_ROUNDS);
        const newUser = {
            email,
            password: hashedPassword,
            avatar,
            progression: { level: 1, experience: 0 }
        };
        yield exports.userCollection.insertOne(newUser);
        return newUser;
    });
}
function seedDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        yield seed();
    });
}
function getCollection(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.userGamesCollection.find({ user_id: userId }).toArray();
    });
}
function addToCollection(entry) {
    return __awaiter(this, void 0, void 0, function* () {
        const existing = yield exports.userGamesCollection.findOne({ user_id: entry.user_id, rawg_id: entry.rawg_id });
        if (existing)
            throw new Error("Game zit al in je collectie");
        yield exports.userGamesCollection.insertOne(entry);
    });
}
function updateStatus(userId, rawgId, status) {
    return __awaiter(this, void 0, void 0, function* () {
        if (status === "playing") {
            yield exports.userGamesCollection.updateMany({ user_id: userId, status: "playing" }, { $set: { status: "backlog" } });
        }
        yield exports.userGamesCollection.updateOne({ user_id: userId, rawg_id: rawgId }, { $set: { status: status } });
    });
}
function removeFromCollection(userId, rawgId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.userGamesCollection.deleteOne({ user_id: userId, rawg_id: rawgId });
    });
}
function changePassword(userId, currentPassword, newPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        if (newPassword.length < 6)
            throw new Error("Nieuw wachtwoord moet minstens 6 tekens lang zijn");
        const user = yield exports.userCollection.findOne({ _id: new mongodb_1.ObjectId(userId) });
        if (!user)
            throw new Error("Gebruiker niet gevonden");
        if (!(yield bcrypt_1.default.compare(currentPassword, user.password))) {
            throw new Error("Huidig wachtwoord is incorrect");
        }
        const hashed = yield bcrypt_1.default.hash(newPassword, SALT_ROUNDS);
        yield exports.userCollection.updateOne({ _id: new mongodb_1.ObjectId(userId) }, { $set: { password: hashed } });
    });
}
function deleteUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.userGamesCollection.deleteMany({ user_id: userId });
        yield exports.userCollection.deleteOne({ _id: new mongodb_1.ObjectId(userId) });
    });
}
function updateAvatar(userId, avatar) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.userCollection.updateOne({ _id: new mongodb_1.ObjectId(userId) }, { $set: { avatar } });
    });
}
