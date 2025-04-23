"use server";

import { CoreMessage, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createStreamableValue, } from "ai/rsc";
import { ReactNode } from "react";

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


// Utils
export async function checkAIAvailability() {
  return !!process.env.OPEN_API_KEY;
}
