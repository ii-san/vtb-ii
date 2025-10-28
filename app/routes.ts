import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
	index("pages/dashboard.tsx"),
	route("chat", "routes/assistant.tsx"),
	route("api/chat", "routes/api/chat.ts"),
] satisfies RouteConfig;
