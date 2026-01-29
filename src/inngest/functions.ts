import prisma from "@/lib/prisma";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

import * as Sentry from "@sentry/nextjs";

// check if API key is defined and not empty
const hasApiKey = (key: string | undefined): boolean => {
  return Boolean(key && key.trim() !== "" && key !== "undefined");
};

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
  async ({ step }) => {
    // using Sentry to log information about the function execution
    Sentry.logger.info("User triggered AI text generation task", {
      log_source: "sentry_test",
    });

    const results: Record<string, unknown> = {};
    const errors: Array<{ provider: string; error: unknown }> = [];

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

export const createWorkflow = inngest.createFunction(
  { id: "workflow-creation" },
  { event: "axon/workflow.created" }, // trigger on this event
  async ({ event, step }) => {
    Sentry.logger.info("User triggered workflow creation", {
      log_source: "sentry_test",
      userId: event.data.userId,
      email: event.data.email,
    });

    // create workflow in database
    const workflow = await step.run("create-workflow", async () => {
      return prisma.workflow.create({
        data: {
          name: `workflow ${Date.now()}`,
          userId: event.data.userId,
        },
      });
    });

    Sentry.logger.info("Workflow created successfully", {
      log_source: "sentry_test",
      workflowId: workflow.id,
      userId: event.data.userId,
    });

    return {
      success: true,
      workflowId: workflow.id,
      workflowName: workflow.name,
      userId: event.data.userId,
    };
  },
);
