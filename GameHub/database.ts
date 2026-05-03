import {Collection, MongoClient} from "mongodb";
import "dotenv/config";
import {Game, User} from "./types";
import bcrypt from 'bcrypt';

const MONGO_URI: string | undefined = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error("MONGO_URI is undefined");

const API_KEY: string | undefined = process.env.API_KEY;
if (!API_KEY) throw new Error("API_KEY is undefined");

export const client: MongoClient = new MongoClient(MONGO_URI);
export const gamesCollection: Collection<Game> = client.db("gamehub").collection("games");
export const gameEntry: Collection<User> = client.db("gamehub").collection("users");

const SALT_ROUNDS : number = 10;

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

export const getGames = async () : Promise<Game[]> => {
    return await gamesCollection.find({}).toArray();
}

const seed = async () => {
    if (await gamesCollection.countDocuments() != 0) return;

    let games: Game[] = [];
    for (let i = 1; i <= 100; i++) {
        const response = await fetch(`https://api.rawg.io/api/games/${i}?key=${API_KEY}`);
        const game: Game = await response.json();
        if (game.name) games.push(game);
        games.push(game);
    }
    await gamesCollection.insertMany(games);
}

export async function login(email: string, password: string) {
    if (email === "" || password === "") {
        throw new Error("Email en wachtwoord zijn verplicht");
    }
    let user: User | null = await gameEntry.findOne<User>({ email: email });
    if (user) {
        if (await bcrypt.compare(password, user.password!)) {
            return user;
        } else {
            throw new Error("Wachtwoord incorrect");
        }
    } else {
        throw new Error("Gebruiker niet gevonden");
    }
}

export async function register(email: string, password: string): Promise<User> {
    if (email === "" || password === "") {
        throw new Error("Email en wachtwoord zijn verplicht");
    }

    const existingUser = await gameEntry.findOne({ email });
    if (existingUser) {
        throw new Error("Gebruiker bestaat al");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser: User = {
        email,
        password: hashedPassword,
        progression: { level: 1, experience: 0 }
    };

    await gameEntry.insertOne(newUser);

    return newUser;
}

export async function seedDatabase() {
    await seed();
}

