import { desc, eq } from "drizzle-orm";
import { db } from "../lib/db";
import { tickets } from "../lib/db/schema";

export class TicketsRepository {
  async findById(input: { ticketId: string }) {
    return await db.query.tickets.findFirst({
      where: eq(tickets.id, input.ticketId),
    });
  }

  async findAll(input: { userId: string }) {
    return await db.query.tickets.findMany({
      where: eq(tickets.userId, input.userId),
      orderBy: [desc(tickets.createdAt)],
    });
  }

  async create(input: { userId: string }) {
    return await db
      .insert(tickets)
      .values({
        userId: input.userId,
        status: "OPEN",
      })
      .$returningId();
  }
}
