import { useQuery } from "@tanstack/react-query";

export type Ticket = {
  id: string;
  department: string | null;
  status: "OPEN" | "TRANSFERRED" | "CLOSED";
  createdAt: string;
};

export const useTickets = () =>
  useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tickets`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            cache: "no-cache",
          },
        );

        const data = await response.json();
        return data as Ticket[];
      } catch (error) {
        console.error("Error fetching tickets:", error);
        throw error;
      }
    },
  });
