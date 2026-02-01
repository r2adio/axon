import { requireAuth } from "@/lib/auth-utils";

export default async function ExecutionsPage() {
  await requireAuth();
  return <h1>Credential Page</h1>;
}
