import mongoose from "mongoose";
import { env } from "./env";

mongoose.set("strictQuery", true);

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.mongoUri);
    console.log(`[db] connected -> ${mongoose.connection.name}`);
  } catch (error) {
    console.error("[db] connection failed:", error);
    process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
