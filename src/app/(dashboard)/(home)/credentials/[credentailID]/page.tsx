import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
  params: Promise<{
    credentailID: string;
  }>;
}

export default async function CredentialPage({ params }: PageProps) {
  await requireAuth();

  const { credentailID } = await params;
  return <h1>Credential ID: {credentailID}</h1>;
}
