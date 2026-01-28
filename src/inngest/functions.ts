import prisma from "@/lib/prisma";
import { inngest } from "./client";

export const testFunction = inngest.createFunction(
  { id: "workflow-creation" },
  { event: "axon/workflow.created" }, // trigger on this event
  async ({ event, step }) => {
    // fetching some data from an API
    await step.sleep("fetch data", "4s");
    // simulating some processing
    await step.sleep("simulate processing", "2s");

    // return { message: `Hello ${event.data.email}!` };
    await step.run("create-workflow", () => {
      return prisma.workflow.create({
        data: { name: "workflow-from-inngest" },
      });
    });
  },
);
