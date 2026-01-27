import { createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/prisma";
export const appRouter = createTRPCRouter({
  getWorkflows: protectedProcedure.query(({ ctx }) => {
    // console.log({ userId: ctx.auth.user.id });

    return prisma.workflow.findMany({
      where: { id: ctx.auth.user.id }, // query db users, which belongs to current user id
    });
  }),

  createWorkflow: protectedProcedure.mutation(() => {
    return prisma.workflow.create({
      data: {
        name: "new workflow",
      },
    });
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
