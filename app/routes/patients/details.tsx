import { Badge } from "~/components/ui/badge";
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

const getPrognosticScore = (patient) => {
	let score = 50; // Base score of 50 (neutral prognosis)

	// Age factor (older age associated with worse prognosis)
	if (patient.Age > 65)
		score -= 15; // Elderly patients: -15 points
	else if (patient.Age > 50) score -= 8; // Middle-aged patients: -8 points
	// Younger patients (≤50): no penalty

	// IDH mutation status (IDH-mutated tumors have better prognosis)
	if (patient.IDH_Mutation !== "wt") score += 20; // IDH-mutated: +20 points
	// IDH wild-type: no bonus (more aggressive, primary GBM)

	// MGMT methylation status (methylated MGMT predicts better TMZ response)
	if (patient.MGMT_Methylation === "Methylated") score += 15; // Methylated: +15 points
	// Unmethylated MGMT: no bonus (TMZ resistance expected)

	// Tumor status (recurrent disease has worse prognosis)
	if (patient.Tumor_Status === "Recurrent") score -= 20; // Recurrent: -20 points
	// Primary tumor: no penalty

	// Ensure score stays within 0-100 range
	return Math.max(0, Math.min(100, score));
};

export async function loader({ params }: Route.LoaderArgs) {
	const clinicalDetails = await data.filter(
		(patient) => patient.patient_id === params.patientId,
	)[0];
	const prognosticScore = getPrognosticScore(clinicalDetails);
	return { prognosticScore, ...clinicalDetails };
}

export default function Page({ params, loaderData }: Route.ComponentProps) {
	const {
		Status,
		Gender,
		Age,
		Diagnosis,
		IDH_Mutation,
		MGMT_Methylation,
		Survival,
		prognosticScore,
	} = loaderData;
	return (
		<>
			<div className="px-4 lg:px-6 py-4">
				<h2 className="text-lg leading-none font-semibold">
					Patient: {params.patientId}{" "}
				</h2>
				<h3 className="text-muted-foreground text-sm">
					{Diagnosis} - {Gender}, Age {Math.floor(+Age)}
				</h3>
			</div>
			<div className="px-4 lg:px-6 py-4">
				<div className="bg-card text-card-foreground grid grid-cols-5 gap-4 rounded-xl border shadow-sm">
					<div className="px-4 lg:px-6 py-4">
						<h4 className="text-base leading-none font-semibold mb-1">
							Status
						</h4>
						<Badge variant={Status === "Deceased" ? "destructive" : "default"}>
							{Status}
						</Badge>
					</div>
					<div className="px-4 lg:px-6 py-4">
						<h4 className="text-base leading-none font-semibold mb-1">
							Survival
						</h4>
						<Badge variant="outline">{Math.round(+Survival)} Months</Badge>
					</div>
					<div className="px-4 lg:px-6 py-4">
						<h4 className="text-base leading-none font-semibold mb-1">
							IDH Status
						</h4>
						<Badge>{IDH_Mutation === "wt" ? "Wild-type" : "Mutated"}</Badge>
					</div>
					<div className="px-4 lg:px-6 py-4">
						<h4 className="text-base leading-none font-semibold mb-1">MGMT</h4>
						<Badge>{MGMT_Methylation}</Badge>
					</div>
					<div className="px-4 lg:px-6 py-4">
						<h4 className="text-base leading-none font-semibold mb-1">
							Prognostic
						</h4>
						<Badge
							className={
								prognosticScore >= 70
									? "bg-success"
									: prognosticScore >= 40
										? "bg-warning"
										: "bg-error"
							}
						>
							{prognosticScore}/100
						</Badge>
					</div>
				</div>
			</div>
		</>
	);
}
