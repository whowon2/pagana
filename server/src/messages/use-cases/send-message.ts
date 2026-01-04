import { eq } from "drizzle-orm";
import { TicketsRepository } from "../../tickets/repository";
import { db } from "../../lib/db";
import { tickets } from "../../lib/db/schema";
import { MessagesRepository } from "../repository";
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../../lib/ai/send-message";
import { transferTool } from "../../lib/ai/transfer-tool";

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export class SendMessageUseCase {
  constructor(
    private readonly ticketRepo: TicketsRepository,
    private readonly messageRepo: MessagesRepository,
  ) {}

  async execute(input: {
    userId: string;
    userContent: string;
    ticketId?: string;
  }) {
    let currentTicketId = input.ticketId;

    if (!currentTicketId) {
      const [newTicket] = await this.ticketRepo.create({
        userId: input.userId,
      });

      currentTicketId = newTicket.id;
    } else {
      const ticket = await this.ticketRepo.findById({
        ticketId: currentTicketId,
      });

      if (!ticket || ticket.status !== "OPEN") {
        return { status: "CLOSED", message: "This support session is closed." };
      }
    }

    await this.messageRepo.insertMessage({
      ticketId: currentTicketId,
      content: input.userContent,
      role: "user",
    });

    const history = await this.messageRepo.getHistory({
      ticketId: currentTicketId,
      limit: 15,
    });

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ functionDeclarations: [transferTool] }],
      },
      contents: [
        ...history.map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        })),
        { role: "user", parts: [{ text: input.userContent }] },
      ],
    });

    const candidate = response.candidates?.[0];
    const functionCallPart = candidate?.content?.parts?.find(
      (part) => part.functionCall,
    );

    if (functionCallPart && functionCallPart.functionCall) {
      const { department, summary } = functionCallPart.functionCall.args as any;

      // Update Ticket
      await db
        .update(tickets)
        .set({
          status: "TRANSFERRED",
          department: department,
          summary: summary,
        })
        .where(eq(tickets.id, currentTicketId));

      const transferMsg = `Transferring to ${department}. Summary: ${summary}`;

      await this.messageRepo.insertMessage({
        content: transferMsg,
        role: "system",
        ticketId: currentTicketId,
      });

      return {
        ticketId: currentTicketId,
        role: "system",
        content: transferMsg,
        action: "TRANSFER",
        meta: { department, summary },
      };
    } else {
      // Normal Text Response
      const aiText =
        candidate?.content?.parts?.[0]?.text ||
        "I'm sorry, I couldn't generate a response.";

      await this.messageRepo.insertMessage({
        ticketId: currentTicketId,
        role: "model",
        content: aiText,
      });

      return {
        ticketId: currentTicketId,
        role: "model",
        content: aiText,
        action: "REPLY",
      };
    }
  }
}
