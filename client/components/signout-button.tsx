"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { BetterAuthActionButton } from "./better-auth-action-button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const router = useRouter();

  return (
    <BetterAuthActionButton
      variant="secondary"
      action={() => {
        return authClient.signOut(undefined, {
          onSuccess: () => router.refresh(),
        });
      }}
    >
      <LogOut />
    </BetterAuthActionButton>
  );
}
