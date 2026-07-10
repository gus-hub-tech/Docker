// Express application backed by a PostgreSQL database.
// Creates a heroes table at startup.
// Endpoints: GET / (greeting), GET /health (health check), POST /heroes/ (create), GET /heroes/ (list).
// See https://expressjs.com/ and https://node-postgres.com/

import express, { type Request, type Response } from "express";
import { Pool } from "pg";
import { readFileSync } from "fs";

const app = express();
const port = parseInt(process.env.PORT ?? "3000", 10);

app.use(express.json());

function getPassword(): string {
  const passwordFile = process.env.POSTGRES_PASSWORD_FILE;
  if (passwordFile) {
    return readFileSync(passwordFile, "utf8").trim();
  }
  return process.env.POSTGRES_PASSWORD ?? "";
}

const pool = new Pool({
  host: process.env.POSTGRES_SERVER,
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: getPassword(),
});

pool
  .query(
    `CREATE TABLE IF NOT EXISTS heroes (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      secret_name TEXT NOT NULL,
      age INTEGER
    )`,
  )
  .catch(console.error);

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.post("/heroes/", async (req: Request, res: Response) => {
  const { name, secret_name, age } = req.body as {
    name: string;
    secret_name: string;
    age?: number;
  };
  const result = await pool.query(
    "INSERT INTO heroes (name, secret_name, age) VALUES ($1, $2, $3) RETURNING *",
    [name, secret_name, age],
  );
  res.json(result.rows[0]);
});

app.get("/heroes/", async (_req: Request, res: Response) => {
  const result = await pool.query("SELECT * FROM heroes");
  res.json(result.rows);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});