import { Hono } from "hono";
import { auth } from "../lib/auth";
import { TicketsRepository } from "./repository";

export const ticketsController = new Hono();

const ticketsRepository = new TicketsRepository();

ticketsController.get("/", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userId = session.user.id;

  const userTickets = await ticketsRepository.findAll({ userId });

  return c.json(userTickets);
});
