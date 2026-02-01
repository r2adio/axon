import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
  params: Promise<{
    workflowID: string;
  }>;
}
export default async function CredentialPage({ params }: PageProps) {
  await requireAuth();

  const { workflowID } = await params;
  return <h1>Workflow ID: {workflowID}</h1>;
}
