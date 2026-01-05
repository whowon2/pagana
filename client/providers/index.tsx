"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Prevents the window from refetching on every single focus,
            // which can sometimes mask the invalidation issue.
            staleTime: 5 * 60 * 1000, // 5min
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        disableTransitionOnChange
        attribute="class"
        defaultTheme="dark"
      >
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
