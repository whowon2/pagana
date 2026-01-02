"use client";

import { ChatSideBar } from "@/components/chat-sidebar";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function Home() {
  const [currentTicketId, setCurrentTicketId] = useState<string | null>(null);

  const handleSelectTicket = (ticketId: string | null) => {
    setCurrentTicketId(ticketId);
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
        session={session.session}
      />
    </div>
  );
}
