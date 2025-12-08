"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const { data } = authClient.useSession();

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      {JSON.stringify(data)}

      {/* renders the logout button, only if the user is logged in */}
      {data && <Button onClick={() => authClient.signOut()}>Logout</Button>}
    </div>
  );
}
