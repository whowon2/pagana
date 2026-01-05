import { Hono } from "hono";
import { auth } from "../lib/auth";
import { SendMessageUseCase } from "./use-cases/send-message";
import { TicketsRepository } from "../tickets/repository";
import { MessagesRepository } from "./repository";

export const messagesController = new Hono();

const ticketRepo = new TicketsRepository();
const messageRepo = new MessagesRepository();
const sendMessageUseCase = new SendMessageUseCase(ticketRepo, messageRepo);

messagesController.post("/", async (c) => {
  const body = await c.req.json();

  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userId = session.user.id;

  const response = await sendMessageUseCase.execute({
    userId,
    userContent: body.message,
    ticketId: body.ticketId,
  });

  return c.json(response);
});

messagesController.get("/:ticketId", async (c) => {
  const ticketId = c.req.param("ticketId");

  const history = await messageRepo.getHistory({ ticketId, limit: 15 });

  return c.json(history);
});
