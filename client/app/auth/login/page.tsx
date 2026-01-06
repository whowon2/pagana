"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SignInTab } from "./_components/sign-in-tab";
import { SignUpTab } from "./_components/sign-up-tab";

type Tab = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<Tab>("signin");

  const { data: session } = authClient.useSession();

  if (session) {
    router.push("/");
  }

  return (
    <div className="flex w-full flex-col flex-1 items-center justify-center gap-4 p-4">
      <Tabs
        value={selectedTab}
        onValueChange={(t) => setSelectedTab(t as Tab)}
        className=""
      >
        {(selectedTab === "signin" || selectedTab === "signup") && (
          <TabsList>
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
        )}
        <TabsContent value="signin">
          <Card>
            <CardHeader className="text-2xl font-bold">
              <CardTitle>Sign In</CardTitle>
            </CardHeader>
            <CardContent>
              <SignInTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signup">
          <Card>
            <CardHeader className="text-2xl font-bold">
              <CardTitle>Sign Up</CardTitle>
            </CardHeader>
            <CardContent>
              <SignUpTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
