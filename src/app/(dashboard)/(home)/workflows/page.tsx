import { requireAuth } from "@/lib/auth-utils";

export default async function WorkflowsPage() {
  await requireAuth();
  return (
    <div>
      <h1>Workflows Page</h1>
      <p>This is the workflows page under the dashboard.</p>
    </div>
  );
}
