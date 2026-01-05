"use client";

import { Bot, CheckCheck, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";

interface Message {
  role: "user" | "model" | "system";
  content: string;
}

interface ChatAreaProps {
  ticketId: string | null;
  onTicketCreated: (id: string) => void;
}

export function ChatArea({ ticketId, onTicketCreated }: ChatAreaProps) {
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [transferData, setTransferData] = useState<{
    dept: string;
    summary: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000";
    const ws = new WebSocket(`${wsUrl}/api/ws`);

    ws.onopen = () => {
      console.log("🟢 Connected to Chat Server");
    };

    ws.onmessage = (event) => {
      setLoading(false);

      try {
        const data = JSON.parse(event.data);

        if (data.ticketId && !ticketId) {
          onTicketCreated(data.ticketId);
        }

        if (data.action === "TRANSFER") {
          setTransferData({
            dept: data.meta.department,
            summary: data.meta.summary,
          });
          setMessages((prev) => [
            ...prev,
            { role: "system", content: data.content },
          ]);
          queryClient.invalidateQueries({ queryKey: ["tickets"] });
        } else {
          setMessages((prev) => [
            ...prev,
            { role: "model", content: data.content },
          ]);
        }
      } catch (e) {
        console.error("Error parsing WS message", e);
      }
    };

    ws.onerror = (error) => {
      setLoading(false);
    };

    ws.onclose = () => {
      console.log("🔴 Disconnected");
    };

    socketRef.current = ws;

    return () => {
      ws.close();
    };
  }, [ticketId, onTicketCreated]);

  // history
  useEffect(() => {
    if (ticketId) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages/${ticketId}`)
        .then((res) => res.json())
        .then((data) => {
          setMessages(data);
          const lastMsg = data[data.length - 1];
          if (
            lastMsg?.role === "system" &&
            lastMsg.content.includes("Transferring")
          ) {
            setTransferData({
              dept: "Existing Ticket",
              summary: "Already transferred",
            });
          } else {
            setTransferData(null);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setMessages([]);
      setTransferData(null);
    }
  }, [ticketId]);

  // scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim() || !socketRef.current) return;

    const userText = input;
    setInput("");

    // optmisitic
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setLoading(true);

    if (socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          message: userText,
          ticketId: ticketId,
        }),
      );
    } else {
      console.error("Socket not open");
      setLoading(false);
    }

    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background relative">
      {/* --- HEADER --- */}
      {/* Changed bg-white to bg-background, border-b to border-border */}
      <header className="h-16 border-b border-border flex items-center px-6 justify-between bg-background z-10 shrink-0">
        <div>
          {/* Changed text-gray-900 to text-foreground */}
          <h1 className="font-bold text-lg text-foreground">
            Support Agent AI
          </h1>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${ticketId ? "bg-green-500" : "bg-blue-500"}`}
            ></span>
            <p className="text-xs text-muted-foreground">
              {ticketId ? `Ticket #${ticketId.slice(0, 8)}` : "New Session"}
            </p>
          </div>
        </div>
        {transferData && (
          <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-200 dark:border-green-800">
            SOLVED / TRANSFERRED
          </span>
        )}
      </header>

      {/* --- MESSAGES AREA --- */}
      {/* Changed bg-gray-50/50 to bg-muted/20 (or dark:bg-zinc-900) */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth bg-muted/20">
        {messages.length === 0 && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
            <Bot size={64} className="mb-4" />
            <p className="text-sm">How can I help you today?</p>
          </div>
        )}

        {messages.map((msg, idx) => {
          const isUser = msg.role === "user";
          const isSystem = msg.role === "system";

          if (isSystem) {
            return (
              <div key={idx} className="flex justify-center my-4">
                {/* Updated system message colors for dark mode */}
                <span className="bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 text-xs px-3 py-1 rounded-full border border-yellow-200 dark:border-yellow-800">
                  {msg.content}
                </span>
              </div>
            );
          }

          return (
            <div
              key={idx}
              className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex max-w-[85%] md:max-w-[70%] gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {isUser ? <User size={14} /> : <Bot size={16} />}
                </div>

                <div
                  className={`p-3.5 text-sm shadow-sm leading-relaxed ${
                    isUser
                      ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-none"
                      : "bg-card border border-border text-foreground rounded-2xl rounded-tl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {loading && (
          <div className="flex w-full justify-start">
            <div className="flex max-w-[85%] gap-3 flex-row">
              <div className="w-8 h-8 rounded-full bg-card border border-border text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-card border border-border p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5 h-[46px]">
                <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-background border-t border-border p-4 shrink-0 z-10">
        {transferData ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600 dark:text-green-400">
              <CheckCheck size={24} />
            </div>
            <h3 className="font-bold text-green-900 dark:text-green-300 mb-1">
              Transferred to {transferData.dept}
            </h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              " {transferData.summary} "
            </p>
          </div>
        ) : (
          <div className="relative max-w-4xl mx-auto flex items-center gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              disabled={loading}
              className="pr-12 py-6 rounded-xl border-input bg-muted/50 focus:bg-background transition-all focus-visible:ring-ring"
            />
            <Button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="absolute right-2 h-9 w-9 p-0 rounded-lg"
            >
              <Send size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
