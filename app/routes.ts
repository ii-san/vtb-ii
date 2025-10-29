import {
	index,
	layout,
	type RouteConfig,
	route,
} from "@react-router/dev/routes";

export default [
	layout("components/layouts/dashboard.tsx", [
		index("routes/dashboard/index.tsx"),
	]),
] satisfies RouteConfig;
