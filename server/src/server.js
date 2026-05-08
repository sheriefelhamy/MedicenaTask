import env from "./config/env.js";
import { connectToDatabase } from "./config/db.js";
import { seedIfEmpty } from "./seed/defaultData.js";
import { createApp } from "./app.js";

async function start() {
  await connectToDatabase(env.mongoUri);
  await seedIfEmpty();

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`Medicena API running on port ${env.port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
