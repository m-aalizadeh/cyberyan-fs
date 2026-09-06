import { createApp } from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";

async function bootstrap(): Promise<void> {
  await connectDatabase();

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`[server] listening on http://localhost:${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error("[server] failed to start:", error);
  process.exit(1);
});
