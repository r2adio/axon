import prisma from "@/lib/prisma";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

const google = createGoogleGenerativeAI();
const openai = createOpenAI();
const anthropic = createAnthropic();

export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai.task" }, // trigger on this event
  async ({ event, step }) => {
    const { steps: geminiSteps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: google("gemini-2.5-flash"),
        system:
          "You are a helpful assistant that generates text based on user prompts.",
        prompt: "current president of the United States is?",
        temperature: 0.7,
      },
    );
    const { steps: openaiSteps } = await step.ai.wrap(
      "openai-generate-text",
      generateText,
      {
        model: openai("gpt-4-turbo"),
        system:
          "You are a helpful assistant that generates text based on user prompts.",
        prompt: "current president of the United States is?",
        temperature: 0.7,
      },
    );
    const { steps: anthropicSteps } = await step.ai.wrap(
      "anthropic-generate-text",
      generateText,
      {
        model: anthropic("claude-sonnet-4-0"),
        system:
          "You are a helpful assistant that generates text based on user prompts.",
        prompt: "current president of the United States is?",
        temperature: 0.7,
      },
    );
    return { geminiSteps, openaiSteps, anthropicSteps };
  },
);
