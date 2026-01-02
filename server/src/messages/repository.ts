import { asc, eq } from "drizzle-orm";
import { db } from "../lib/db";
import { messages } from "../lib/db/schema";

export class MessagesRepository {
  async insertMessage(input: {
    ticketId: string;
    content: string;
    role: "user" | "system" | "model";
  }) {
    return await db.insert(messages).values(input);
  }

  async getHistory(input: { ticketId: string; limit: number }) {
    return await db.query.messages.findMany({
      where: eq(messages.ticketId, input.ticketId),
      orderBy: [asc(messages.createdAt)],
      limit: input.limit,
    });
  }
}
