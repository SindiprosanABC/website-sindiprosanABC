import { MongoClient, Db } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 10000,
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
    });

    await client.connect();
    const db = client.db(dbName);

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export async function getNewsCollection() {
  const { db } = await connectToDatabase();
  return db.collection("news_articles");
}

export async function getJobsCollection() {
  const { db } = await connectToDatabase();
  return db.collection("job_vacancies");
}

export async function getAdminUsersCollection() {
  const { db } = await connectToDatabase();
  return db.collection("admin_users");
}

export async function getTagsCollection() {
  const { db } = await connectToDatabase();
  return db.collection("news_tags");
}
