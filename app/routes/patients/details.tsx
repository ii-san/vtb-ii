import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import data from "~~/patients/clinical.json";
import type { Route } from "./+types/details";
export const handle = {
	pageName: "Patient Details",
};

export async function loader({ params }: Route.LoaderArgs) {
	const clinicalDetails = await data.filter(
		(patient) => patient.patient_id === params.patientId,
	)[0];
	return clinicalDetails;
}

export default function Page({ params, loaderData }: Route.ComponentProps) {
	const { Status, Gender, Age, Diagnosis } = loaderData;
	return (
		<div className="px-4 lg:px-6 py-4">
			<h1>yo</h1>
			<h3>yo</h3>
			<Card className="@container/card">
				<CardHeader>
					<CardTitle>Patient: {params.patientId} </CardTitle>
					<CardDescription>
						<span className="hidden @[540px]/card:block">
							{Diagnosis} - {Gender}, Age {Math.floor(+Age)}
						</span>
						<span className="@[540px]/card:hidden">Last 3 months</span>
					</CardDescription>
				</CardHeader>
			</Card>
		</div>
		// <div className="px-4 lg:px-6">
		// 	hi ya - {params.patientId} | Status : {Status}
		// </div>
	);
}
