"use client";

import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function Home() {
  // await requireAuth();

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useQuery(trpc.getWorkflows.queryOptions());
  const testAPI = useMutation(
    trpc.testAPI.mutationOptions({
      onSuccess: () => {
        toast.success("Inngest function invoked successfully");
      },
    }),
  );

  const create = useMutation(
    trpc.createWorkflow.mutationOptions({
      onSuccess: () => {
        toast.success("Workflow creation started in background");
      },
    }),
  );

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6">
      protected page (login to access)
      <div>{JSON.stringify(data, null, 2)}</div>
      <Button disabled={testAPI.isPending} onClick={() => testAPI.mutate()}>
        Test API
      </Button>
      {/* TODO: need to refetch the workflows after creation */}
      <Button disabled={create.isPending} onClick={() => create.mutate()}>
        Create Workflow
      </Button>
      <LogoutButton />
    </div>
  );
}
