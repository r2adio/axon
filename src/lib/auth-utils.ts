import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";

export const requireAuth = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    // when user ain't logged in, and visit protected pages
    redirect("/login");
  }
  return session;
};
export const requireUnauth = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    // when user is logged in, and vists /login page
    redirect("/");
  }
};
