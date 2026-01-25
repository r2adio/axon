import { LogoutButton } from "@/features/auth/components/logout-button";
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";

export default async function Home() {
  await requireAuth();

  const data = await caller.getUsers();
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6">
      protected page (login to access)
      <div>{JSON.stringify(data, null, 2)}</div>
      <LogoutButton />
    </div>
  );
}
