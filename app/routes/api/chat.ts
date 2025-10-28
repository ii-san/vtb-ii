import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { frontendTools } from "@assistant-ui/react-ai-sdk";
import { convertToModelMessages, streamText } from "ai";
import type { ActionFunctionArgs } from "react-router";

const lmstudio = createOpenAICompatible({
	name: "lmstudio",
	baseURL: "http://localhost:1234/v1",
});

export const maxDuration = 30;

export const action = async ({ request }: ActionFunctionArgs) => {
	const { messages, system, tools } = await request.json();

	const result = streamText({
		model: lmstudio("ibm/granite-3.1-8b"),
		messages: convertToModelMessages(messages),
		system,
		tools: {
			...frontendTools(tools),
			// add backend tools here
		},
	});

	return result.toUIMessageStreamResponse();
};
