import prisma from "@/lib/prisma";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

import * as Sentry from "@sentry/nextjs";

// Helper function to check if API key is available and valid
const hasApiKey = (key: string | undefined): boolean => {
  return Boolean(key && key.trim() !== "" && key !== "undefined");
};

// Conditional provider initialization based on API key availability
const providers = {
  google: hasApiKey(process.env.GOOGLE_GENERATIVE_AI_API_KEY)
    ? createGoogleGenerativeAI()
    : null,
  openai: hasApiKey(process.env.OPENAI_API_KEY) ? createOpenAI() : null,
  anthropic: hasApiKey(process.env.ANTHROPIC_API_KEY)
    ? createAnthropic()
    : null,
};

export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai.task" }, // trigger on this event
  async ({ event, step }) => {
    // using Sentry to log information about the function execution
    Sentry.logger.info("User triggered AI text generation task", {
      log_source: "sentry_test",
    });

    const results: Record<string, unknown> = {};
    const errors: Array<{ provider: string; error: unknown }> = [];

    // Execute Gemini (Google) if API key is available
    if (providers.google) {
      try {
        const { steps: geminiSteps } = await step.ai.wrap(
          "gemini-generate-text",
          generateText,
          {
            model: providers.google("gemini-2.5-flash"),
            system:
              "You are a helpful assistant that generates text based on user prompts.",
            prompt: "current president of the United States is?",
            temperature: 0.7,
            experimental_telemetry: {
              isEnabled: true,
              recordInputs: true,
              recordOutputs: true,
            },
          },
        );
        results.gemini = geminiSteps;
      } catch (error) {
        errors.push({ provider: "gemini", error });
        Sentry.logger.error("Gemini AI generation failed", {
          provider: "gemini",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    } else {
      errors.push({
        provider: "gemini",
        error: "API key not available",
      });
    }

    // Execute OpenAI if API key is available
    if (providers.openai) {
      try {
        const { steps: openaiSteps } = await step.ai.wrap(
          "openai-generate-text",
          generateText,
          {
            model: providers.openai("gpt-4-turbo"),
            system:
              "You are a helpful assistant that generates text based on user prompts.",
            prompt: "current president of the United States is?",
            temperature: 0.7,
            experimental_telemetry: {
              isEnabled: true,
              recordInputs: true,
              recordOutputs: true,
            },
          },
        );
        results.openai = openaiSteps;
      } catch (error) {
        errors.push({ provider: "openai", error });
        Sentry.logger.error("OpenAI generation failed", {
          provider: "openai",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    } else {
      errors.push({
        provider: "openai",
        error: "API key not available",
      });
    }

    // Execute Anthropic if API key is available
    if (providers.anthropic) {
      try {
        const { steps: anthropicSteps } = await step.ai.wrap(
          "anthropic-generate-text",
          generateText,
          {
            model: providers.anthropic("claude-sonnet-4-0"),
            system:
              "You are a helpful assistant that generates text based on user prompts.",
            prompt: "current president of the United States is?",
            temperature: 0.7,
            experimental_telemetry: {
              isEnabled: true,
              recordInputs: true,
              recordOutputs: true,
            },
          },
        );
        results.anthropic = anthropicSteps;
      } catch (error) {
        errors.push({ provider: "anthropic", error });
        Sentry.logger.error("Anthropic generation failed", {
          provider: "anthropic",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    } else {
      errors.push({
        provider: "anthropic",
        error: "API key not available",
      });
    }

    // Log execution summary
    Sentry.logger.info("AI task execution completed", {
      successfulProviders: Object.keys(results),
      failedProviders: errors.map((e) => e.provider),
      totalProviders: 3,
    });

    return {
      results,
      errors,
      summary: {
        totalProviders: 3,
        successfulProviders: Object.keys(results).length,
        failedProviders: errors.length,
      },
    };
  },
);
