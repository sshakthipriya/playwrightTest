import { MongoClient, Db } from "mongodb";

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "fieldexchange";

let client: MongoClient;
let db: Db;

declare global {
  var _mongoClient: MongoClient | undefined;
}

export async function getDb(): Promise<Db> {
  if (db) return db;

  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(MONGO_URL);
    await global._mongoClient.connect();
  }
  client = global._mongoClient;
  db = client.db(DB_NAME);
  return db;
}
