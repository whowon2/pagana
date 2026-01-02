import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { auth } from "./lib/auth";

const app = new Hono();

app.use(logger());
app.use(
  "*",
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

// Better Auth
app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

export default {
  port: 4000,
  fetch: app.fetch,
};
