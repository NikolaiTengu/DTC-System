const connectDb = require("./config/db");
const env = require("./config/env");
const createApp = require("./app");

async function bootstrap() {
  await connectDb();
  const { server } = createApp();
  server.listen(env.port, () => {
    console.log(`DTC server listening on port ${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Server bootstrap failed", error);
  process.exit(1);
});
