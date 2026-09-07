import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  port: number;
  mongoUri: string;
  nodeEnv: string;
}

function getEnv(): EnvConfig {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error(
      "Missing required environment variable: MONGO_URI"
    );
  }

  return {
    port: Number(process.env.PORT) || 4000,
    mongoUri,
    nodeEnv: process.env.NODE_ENV || "development",
  };
}

export const env = getEnv();
