import { AssistantRuntimeProvider } from "@assistant-ui/react";
import {
	AssistantChatTransport,
	useChatRuntime,
} from "@assistant-ui/react-ai-sdk";
import { Thread } from "~/components/assistant-ui/thread";
import { ThreadList } from "~/components/assistant-ui/thread-list";
export const handle = {
	pageName: "AI Chat",
};

const Assistant = () => {
	const runtime = useChatRuntime({
		transport: new AssistantChatTransport({
			api: "/api/chat",
		}),
	});

	return (
		<AssistantRuntimeProvider runtime={runtime}>
			<div className="grid  h-[calc(100vh-120px)]  grid-cols-[200px_1fr] gap-x-2 px-4 py-4">
				<ThreadList />
				<Thread />
			</div>
		</AssistantRuntimeProvider>
	);
};

export default Assistant;
