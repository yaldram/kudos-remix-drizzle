require("dotenv/config");

if (process.env.NODE_ENV === "production") return;

const { drizzle } = require("drizzle-orm/postgres-js");
const { migrate } = require("drizzle-orm/postgres-js/migrator");
const postgres = require("postgres");

const dbConnection = postgres(process.env.DATABASE_URL, { max: 1 });
const db = drizzle(dbConnection);

migrate(db, { migrationsFolder: "migrations" })
  .then(() => {
    console.log("Migrations ran successfully");
    process.exit();
  })
  .catch((error) => {
    console.log("Error running migrations", error);
    process.exit(1);
  });
