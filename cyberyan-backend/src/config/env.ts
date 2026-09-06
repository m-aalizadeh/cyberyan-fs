import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  port: number;
  mongoUri: string;
  nodeEnv: string;
}

/**
 * Centralized, typed access to environment variables.
 * Fails fast if something required is missing, instead of
 * letting `undefined` leak into the rest of the app.
 */
function getEnv(): EnvConfig {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error(
      "Missing required environment variable: MONGO_URI. Did you copy .env.example to .env?"
    );
  }

  return {
    port: Number(process.env.PORT) || 4000,
    mongoUri,
    nodeEnv: process.env.NODE_ENV || "development",
  };
}

export const env = getEnv();
