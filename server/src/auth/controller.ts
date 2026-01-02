import { Hono } from "hono";
import { auth } from "../lib/auth";

export const authController = new Hono();

authController.on(["POST", "GET"], "/api/auth/*", (c) =>
  auth.handler(c.req.raw),
);
