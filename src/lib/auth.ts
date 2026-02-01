import { checkout, polar, portal } from "@polar-sh/better-auth";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// import { PrismaClient } from "@generated/prisma/client";
import prisma from "@/lib/prisma";
import { polarClient } from "./polar";

export const auth = betterAuth({
  // database client
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // authentication methods
  emailAndPassword: { enabled: true, autoSignIn: true },

  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [{ productId: "f81be8a8-45e1", slug: "pro" }],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true,
        }),
        portal(),
      ],
    }),
  ],
});
