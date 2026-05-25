import {Collection, MongoClient, ObjectId} from "mongodb";
import "dotenv/config";
import {Game, GameEntry, User} from "./types";
import bcrypt from 'bcrypt';

export const MONGO_URI: string | undefined = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error("MONGO_URI is undefined");

const API_KEY: string | undefined = process.env.API_KEY;
if (!API_KEY) throw new Error("API_KEY is undefined");

export const client: MongoClient = new MongoClient(MONGO_URI);
    
export const gamesCollection: Collection<Game> = client.db("gamehub").collection("games");
export const userCollection: Collection<User> = client.db("gamehub").collection("users");
export const userGamesCollection: Collection<GameEntry> = client.db("gamehub").collection<GameEntry>("userGames");

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
        if (game.name) 
        {
            games.push(game);
        }
    }
    await gamesCollection.insertMany(games);
}

export async function login(email: string, password: string) {
    if (email === "" || password === "") {
        throw new Error("Email en wachtwoord zijn verplicht");
    }
    let user: User | null = await userCollection.findOne<User>({ email: email });
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

export async function register(email: string, password: string, avatar: string): Promise<User> {
    if (email === "" || password === "") {
        throw new Error("Email en wachtwoord zijn verplicht");
    }

    const existingUser = await userCollection.findOne({ email });
    if (existingUser) {
        throw new Error("Gebruiker bestaat al");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser: User = {
        email,
        password: hashedPassword,
        avatar,
        progression: {level: 1, experience: 0}
    };

    await userCollection.insertOne(newUser);

    return newUser;
}

export async function seedDatabase() {
    await seed();
}

export async function getCollection(userId: string): Promise<GameEntry[]> {
    return await userGamesCollection.find({ user_id: userId }).toArray();
}

export async function addToCollection(entry: GameEntry): Promise<void> {
    const existing = await userGamesCollection.findOne({ user_id: entry.user_id, rawg_id: entry.rawg_id });
    if (existing) throw new Error("Game zit al in je collectie");
    await userGamesCollection.insertOne(entry);
}

export async function updateStatus(userId: string, rawgId: number, status: "backlog" | "playing" | "finished"): Promise<void> {
    if (status === "playing") {
        await userGamesCollection.updateMany(
            { user_id: userId, status: "playing" },
            { $set: { status: "backlog" } }
        );
    }
    await userGamesCollection.updateOne(
        { user_id: userId, rawg_id: rawgId },
        { $set: { status: status } }
    );
}

export async function removeFromCollection(userId: string, rawgId: number): Promise<void> {
    await userGamesCollection.deleteOne({ user_id: userId, rawg_id: rawgId });
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    if (newPassword.length < 6) throw new Error("Nieuw wachtwoord moet minstens 6 tekens lang zijn");

    const user = await userCollection.findOne({ _id: new ObjectId(userId) } as any);
    if (!user) throw new Error("Gebruiker niet gevonden");

    if (!(await bcrypt.compare(currentPassword, user.password!))) {
        throw new Error("Huidig wachtwoord is incorrect");
    }

    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await userCollection.updateOne({ _id: new ObjectId(userId) } as any, { $set: { password: hashed } });
}

export async function deleteUser(userId: string): Promise<void> {
    await userGamesCollection.deleteMany({ user_id: userId });
    await userCollection.deleteOne({ _id: new ObjectId(userId) } as any);
}

export async function updateAvatar(userId: string, avatar: string): Promise<void> {
    await userCollection.updateOne({ _id: new ObjectId(userId) } as any, { $set: { avatar } });
}