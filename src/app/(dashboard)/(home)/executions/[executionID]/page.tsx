import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
  params: Promise<{
    executionID: string;
  }>;
}

export default async function CredentialPage({ params }: PageProps) {
  await requireAuth();

  const { executionID } = await params;
  return <h1>Execution ID: {executionID}</h1>;
}
