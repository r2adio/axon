import { inngest } from "./client";

export const testFunction = inngest.createFunction(
  { id: "test-email" },
  { event: "test/test.email" }, // trigger on this event
  async ({ event, step }) => {
    await step.sleep("long-running-process", "5s");
    return { message: `Hello ${event.data.email}!` };
  },
);
