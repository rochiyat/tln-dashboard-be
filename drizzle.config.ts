import type { Config } from "drizzle-kit";

export default {
    schema: "./src/infrastructure/database/schema/*.ts",
    out: "./src/infrastructure/database/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.PG_URL || "",
    },
    verbose: true,
    strict: true,
} satisfies Config;