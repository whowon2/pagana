"use client";

import { ChatArea } from "@/components/chat";
import { ChatSideBar } from "@/components/chat-sidebar";
import { authClient } from "@/lib/auth-client";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function Home() {
  const queryClient = useQueryClient();
  const [currentTicketId, setCurrentTicketId] = useState<string | null>(null);

  const handleSelectTicket = (ticketId: string | null) => {
    setCurrentTicketId(ticketId);
  };

  const handleTicketCreated = (newId: string) => {
    setCurrentTicketId(newId);
    queryClient.invalidateQueries({ queryKey: ["tickets"] });
  };

  const { data: session } = authClient.useSession();

  if (!session) {
    return <div>You are not logged in</div>;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <ChatSideBar
        onSelectTicket={handleSelectTicket}
        currentTicketId={currentTicketId}
        user={session.user}
      />
      <main className="flex-1 flex flex-col min-w-0 text-gray-900">
        <ChatArea
          ticketId={currentTicketId}
          onTicketCreated={handleTicketCreated}
        />
      </main>
    </div>
  );
}
