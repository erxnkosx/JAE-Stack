import {Collection, MongoClient} from "mongodb";
import "dotenv/config";
import {Game, User} from "./types";
import bcrypt from 'bcrypt';
import crypto from "crypto";

const MONGO_URI: string | undefined = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error("MONGO_URI is undefined");

const API_KEY: string | undefined = process.env.API_KEY;
if (!API_KEY) throw new Error("API_KEY is undefined");

export const client: MongoClient = new MongoClient(MONGO_URI);
export const gamesCollection: Collection<Game> = client.db("gamehub").collection("games");
export const gameEntry: Collection<User> = client.db("gamehub").collection("users");

export const SALT_ROUNDS = 10;

const exit = async () => {
    try {
        await client.close();
        console.log("Disconnected from database");
    } catch (error) {
        console.error(error);
    } finally {
        process.exit(0);
    }
}

export const connect = async () => {
    try {
        await client.connect();
        await seedDatabase();
        console.log("Connected to database");
        process.on("SIGINT", exit);
    } catch (error) {
        console.error(error);
    }
}

export const getGames = async () => {
    return await gamesCollection.find().toArray();
}

const seed = async () => {
    if (await gamesCollection.countDocuments() != 0) return;

    let games: Game[] = [];
    for (let i = 1; i <= 100; i++) {
        const response = await fetch(`https://api.rawg.io/api/games/${i}?key=164c603c781d4e0785a394b1f75b17b8`);
        const game: Game = await response.json();
        games.push(game);
    }
    await gamesCollection.insertMany(games);
}

export async function login(email: string, password: string) {
    if (email === "" || password === "") {
        throw new Error("Email and password required");
    }
    let user : User | null = await gameEntry.findOne<User>({email: email});
    if (user) {
        if (await bcrypt.compare(password, user.password!)) {
            return user;
        } else {
            throw new Error("Password incorrect");
        }
    } else {
        throw new Error("User not found");
    }
}

export async function register(email: string, password: string): Promise<User> {
    if (email === "" || password === "") {
        throw new Error("Email and password required");
    }

    const existingUser = await gameEntry.findOne({ email });
    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser: User = {
        id: crypto.randomUUID(),
        email,
        password: hashedPassword,
        progression: {
            level: 1,
            experience: 0
        }
    };

    await gameEntry.insertOne(newUser);

    return newUser;
}

export async function seedDatabase() {
    await seed();
}

