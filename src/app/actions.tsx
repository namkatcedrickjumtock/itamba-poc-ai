"use server";

import { CoreMessage, streamText, generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createStreamableValue, createStreamableUI } from "ai/rsc";
import { Weather } from "@/components/weather";
import { ReactNode } from "react";
import { z } from "zod";

export interface Message {
  role: "user" | "assistant";
  content: string | string [];
  display?: ReactNode;
}

// Streaming Chat
export async function continueTextConversation(messages: CoreMessage[]) {
  const result = await streamText({
    headers: {
      Authorization: `Bearer ${process.env.OPEN_API_KEY}`,
    },
    model: openai("o1-mini"),
    messages,
    temperature: 1, // Fixed: Only value supported by o1-mini
  });

  const stream = createStreamableValue(result.textStream);
  return stream.value;
}

// Gen UIs
export async function continueConversation(history: Message[]) {
  const stream = createStreamableUI();

  const { text, toolResults } = await generateText({
    headers: {
      Authorization: `Bearer ${process.env.OPEN_API_KEY}`,
    },
    model: openai("o1-mini"),
    system: "You are a friendly weather assistant!",
    messages: history,
    temperature: 1, // Fixed: Only value supported by o1-mini
    tools: {
      showWeather: {
        description: "Show the weather for a given location.",
        parameters: z.object({
          city: z.string().describe("The city to show the weather for."),
          unit: z
            .enum(["F"])
            .describe("The unit to display the temperature in"),
        }),
        execute: async ({ city, unit }) => {
          stream.done(<Weather city={city} unit={unit} />);
          return `Here's the weather for ${city}!`;
        },
      },
    },
  });

  return {
    messages: [
      ...history,
      {
        role: "assistant" as const,
        content:
          text || toolResults.map((toolResult) => toolResult.result).join(),
        display: stream.value,
      },
    ],
  };
}

// Utils
export async function checkAIAvailability() {
  return !!process.env.OPEN_API_KEY;
}
