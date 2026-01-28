import { createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/prisma";
export const appRouter = createTRPCRouter({
  getWorkflows: protectedProcedure.query(() => {
    // console.log({ userId: ctx.auth.user.id });

    // return prisma.workflow.findMany({
    //   where: { id: ctx.auth.user.id }, // query db users, which belongs to current user id
    // });
    return prisma.workflow.findMany();
  }),

  createWorkflow: protectedProcedure.mutation(async () => {
    // instead of adding long processing here, we will use background jobs (e.g. with BullMQ)
    // it handles the job processing outside of the request-response cycle

    return prisma.workflow.create({
      data: {
        name: "new workflow",
      },
    });
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
