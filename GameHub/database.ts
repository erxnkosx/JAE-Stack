import {Collection, MongoClient} from "mongodb";
import "dotenv/config";
import {Game} from "./types";
// Vars init
const MONGO_URI: string | undefined = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error("MONGO_URI is undefined");

const API_KEY: string | undefined = process.env.API_KEY;
if (!API_KEY) throw new Error("API_KEY is undefined");


// Mongo setup
const client: MongoClient = new MongoClient(MONGO_URI);
const gamesCollection: Collection<Game> = client.db("gamehub").collection("games");

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
        await seed();
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
