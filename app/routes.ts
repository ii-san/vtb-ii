import {
	index,
	layout,
	type RouteConfig,
	route,
} from "@react-router/dev/routes";

import {
	IconBrain,
	IconChartBar,
	IconFirstAidKit,
	IconHelp,
	IconPills,
	IconReport,
	IconSearch,
	IconSettings,
	IconUsers,
} from "@tabler/icons-react";

export default [
	layout("components/layouts/dashboard.tsx", [
		index("routes/dashboard/index.tsx"),
		route("patients", "routes/patients/index.tsx"),
		route("patients/:patientId/:detailTab?", "routes/patients/details.tsx"),
	]),
	route("api/settings", "routes/actions/preferences.ts"),
] satisfies RouteConfig;

export const RouteNav = {
	user: {
		name: "Dr. Smith",
		email: "dr@example.com",
		avatar: "/avatars/1.jpg",
	},
	navMain: [
		{
			title: "Patients",
			url: "/patients",
			icon: IconUsers,
		},
		{
			title: "Network Analysis",
			url: "/#analysis",
			icon: IconChartBar,
		},
		{
			title: "Drug Predictions",
			url: "/#predictions",
			icon: IconPills,
		},
		// {
		// 	title: "AI Recommendations",
		// 	url: "/chat",
		// 	icon: IconBrain,
		// },
	],
	navSecondary: [
		{
			title: "Settings",
			url: "#",
			icon: IconSettings,
		},
		{
			title: "Get Help",
			url: "#",
			icon: IconHelp,
		},
		{
			title: "Search",
			url: "#",
			icon: IconSearch,
		},
	],
	documents: [
		{
			name: "Patient Summary",
			url: "#",
			icon: IconReport,
		},
		{
			name: "Treatement Outcomes",
			url: "#",
			icon: IconFirstAidKit,
		},
	],
};
