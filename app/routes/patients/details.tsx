import type { Route } from "./+types/details";

export const handle = {
	pageName: "Patient Details",
};

// export default function Page() {
// 	return <div>Here are some patients</div>;
// }

export default function Page({ params }: Route.ComponentProps) {
	return <div className="px-4 lg:px-6">hi ya - {params.patientId}</div>;
}
