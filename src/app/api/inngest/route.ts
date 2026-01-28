import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { testFunction } from "@/inngest/functions";

// API route for Inngest to handle events and functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [testFunction],
});
