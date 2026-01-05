import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { auth } from "./lib/auth";
import { db } from "./lib/db";
import { ticketsController } from "./tickets/controller";
import { messagesController } from "./messages/controller";
import { websocket } from "hono/bun";
import { socketApp } from "./socket";

const app = new Hono();

app.use(logger());
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "https://pagana.vercel.app"],
    credentials: true,
  }),
);

// Better Auth
app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.route("/api/tickets", ticketsController);
app.route("/api/messages", messagesController);
app.route("/api/ws", socketApp);

export default {
  port: 4000,
  fetch: app.fetch,
  websocket,
};
