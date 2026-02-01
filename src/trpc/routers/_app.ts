import { inngest } from "@/inngest/client";
import { createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/prisma";

// updating protectedProcedure to premiumProcedure will restrict access to premium users only
export const appRouter = createTRPCRouter({
  testAI: protectedProcedure.mutation(async () => {
    await inngest.send({ name: "execute/ai.task" });
    return { success: true, message: "Inngest function invoked" };
  }),

  getWorkflows: protectedProcedure.query(() => {
    // console.log({ userId: ctx.auth.user.id });

    // return prisma.workflow.findMany({
    //   where: { id: ctx.auth.user.id }, // query db users, which belongs to current user id
    // });
    return prisma.workflow.findMany();
  }),

  createWorkflow: protectedProcedure.mutation(async ({ ctx }) => {
    // instead of adding long processing here, we will use background jobs (e.g. with BullMQ)
    // it handles the job processing outside of the request-response cycle

    // invokes the inngest function automatically in the background
    await inngest.send({
      name: "axon/workflow.created", // function to invoke
      data: { email: ctx.auth.user.email, userId: ctx.auth.user.id },
    });

    // immediate response
    return {
      success: true,
      message: "Workflow creation started in background",
    };
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
