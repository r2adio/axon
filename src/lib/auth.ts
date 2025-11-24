import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// import { PrismaClient } from "@generated/prisma/client";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  // database client
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // authentication methods
  emailAndPassword: { enabled: true },
});
