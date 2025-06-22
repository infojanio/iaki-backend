import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(33433), // porta na railway: 33433 , porta local: 3333
  DATABASE_URL: z.string().url(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("Invalid environmet variables", _env.error.format());

  throw new Error("Invalid environment variables.");
}

export const env = _env.data;
