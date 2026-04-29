const connectDb = require("../config/db");
const { seedDefaults } = require("./defaults");

async function run() {
  await connectDb();
  const result = await seedDefaults();
  console.log("Seed completed", {
    superAdmin: result.superAdmin.email,
    operator: result.operator.email,
    pcs: result.pcCount,
    event: result.event.title,
    feedbackTemplate: result.feedbackTemplate.name
  });
  process.exit(0);
}

run().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
