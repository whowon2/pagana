"use client";

import { useTickets } from "@/hooks/use-tickets";
import { User } from "better-auth";
import { PlusCircle } from "lucide-react";
import { Button } from "./ui/button";
import { SignOutButton } from "./signout-button";

interface ChatSidebarProps {
  onSelectTicket: (ticketId: string | null) => void;
  currentTicketId: string | null;
  user: User;
}

export function ChatSideBar({
  onSelectTicket,
  currentTicketId,
  user,
}: ChatSidebarProps) {
  const { data: tickets, isPending } = useTickets();

  if (isPending) return <div>Loading...</div>;

  if (!tickets) return <div>No tickets found</div>;

  return (
    <aside className="w-64 h-screen flex flex-col border-r">
      <div className="p-3 border-b h-16">
        <Button
          onClick={() => onSelectTicket(null)}
          variant={"outline"}
          className="w-full flex items-center justify-center gap-2"
        >
          <PlusCircle size={18} />
          New Support Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {tickets.map((ticket) => (
          <button
            key={ticket.id}
            onClick={() => onSelectTicket(ticket.id)}
            className={`w-full border-b rounded text-left p-3 transition-all ${
              currentTicketId === ticket.id
                ? "border border-amber-400"
                : "bg-transparent hover:bg-accent cursor-pointer"
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  ticket.status === "TRANSFERRED"
                    ? "text-green-700"
                    : "text-yellow-700"
                }`}
              >
                {ticket.status}
              </span>
              <span className="text-[10px]">
                {new Date(ticket.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm font-medium truncate">
              {ticket.department || "General Support"}
            </p>
          </button>
        ))}
      </div>

      <div className="p-4 border-t flex justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs">
            {user.name.charAt(0) || "U"}
          </div>
          <div className="text-sm">
            <p className="font-medium">{user.name}</p>
            <p className="text-xs">Online</p>
          </div>
        </div>
        <SignOutButton />
      </div>
    </aside>
  );
}
