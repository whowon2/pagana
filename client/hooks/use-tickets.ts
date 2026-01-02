import { useQuery } from "@tanstack/react-query";

export const useTickets = () =>
  useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tickets`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching tickets:", error);
        throw error;
      }
    },
  });
