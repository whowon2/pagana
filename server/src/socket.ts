import { Hono } from "hono";
import { upgradeWebSocket } from "hono/bun";
import { auth } from "./lib/auth";
import { MessagesRepository } from "./messages/repository";
import { SendMessageUseCase } from "./messages/use-cases/send-message";
import { TicketsRepository } from "./tickets/repository";

export const socketApp = new Hono();

const ticketRepo = new TicketsRepository();
const messageRepo = new MessagesRepository();
const sendMessageUseCase = new SendMessageUseCase(ticketRepo, messageRepo);

socketApp.get(
  "/",
  upgradeWebSocket(async (c) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return undefined;
    }

    const userId = session.user.id;

    return {
      onOpen(_event, ws) {
        console.log(`Connection opened for user: ${userId}`);
      },
      async onMessage(event, ws) {
        try {
          const data = JSON.parse(event.data.toString());
          const { message, ticketId } = data;

          if (!message) return;

          const response = await sendMessageUseCase.execute({
            userId,
            userContent: message,
            ticketId: ticketId || undefined,
          });

          ws.send(JSON.stringify(response));
        } catch (error) {
          console.error("Socket processing error:", error);
          ws.send(
            JSON.stringify({
              role: "system",
              content: "Error processing your request.",
            }),
          );
        }
      },
      onClose() {
        console.log(`Connection closed for user: ${userId}`);
      },
    };
  }),
);
