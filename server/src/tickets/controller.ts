import { Hono } from "hono";
import { auth } from "../lib/auth";
import { TicketsRepository } from "./repository";

export const ticketsController = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

const ticketsRepository = new TicketsRepository();

ticketsController.get("/", async (c) => {
  const user = c.get("user");

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userTickets = await ticketsRepository.findAll({ userId: user.id });

  return c.json(userTickets);
});
