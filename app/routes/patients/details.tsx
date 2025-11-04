import { Suspense, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Label } from "~/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { Patient } from "~/services/patientService";
import patientService from "~/services/patientService";
import vtbService from "~/services/vtbService";

import type { Route } from "./+types/details";
import ClinicalOverview from "./section-clinical";
import MolecularProfile from "./section-molecular";
import NetworkAnalysis from "./section-network";
import ComprehensiveReport from "./section-report";
import SimilarPatients from "./section-similar";
import { SkeletonCard } from "./section-skeleton";

export const handle = {
	pageName: "Patient Details",
};

const getPrognosticScore = (patient: Patient) => {
	let score = 50; // Base score of 50 (neutral prognosis)

	// Age factor (older a	ge associated with worse prognosis)
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
	const treatments = vtbService.getPatientTreatments(params.patientId);

	const molecular = patientService.getPatientMutations(params.patientId);

	const clinical = await patientService
		.getPatientClinical(params.patientId)
		.then((patient) => {
			const prognosticScore = getPrognosticScore(patient!);
			return { prognosticScore, ...patient };
		});

	return { clinical, treatments, molecular };
}

export default function Page({ params, loaderData }: Route.ComponentProps) {
	const { clinical } = loaderData;

	const [activeTab, setActiveTab] = useState(params.detailTab || "clinical");

	return (
		<div>
			<div className="px-4 lg:px-6 py-4">
				<h2 className="text-lg leading-none font-semibold">
					Patient: {params.patientId}{" "}
				</h2>
				<h3 className="text-muted-foreground text-sm">
					{clinical.Diagnosis} - {clinical.Gender}, Age{" "}
					{Math.floor(+clinical.Age)}
				</h3>
			</div>
			{/* Patient Summary */}
			<div className="px-4 lg:px-6 py-4">
				<div className="bg-card text-card-foreground grid grid-cols-5 gap-4 rounded-xl border shadow-sm">
					<div className="px-4 lg:px-6 py-4">
						<h4 className="text-base leading-none font-semibold mb-1">
							Status
						</h4>
						<Badge
							variant={
								clinical.Status === "Deceased" ? "destructive" : "default"
							}
						>
							{clinical.Status}
						</Badge>
					</div>
					<div className="px-4 lg:px-6 py-4">
						<h4 className="text-base leading-none font-semibold mb-1">
							Survival
						</h4>
						<Badge variant="outline">
							{Math.round(+clinical.Survival)} Months
						</Badge>
					</div>
					<div className="px-4 lg:px-6 py-4">
						<h4 className="text-base leading-none font-semibold mb-1">
							IDH Status
						</h4>
						<Badge>
							{clinical.IDH_Mutation === "wt" ? "Wild-type" : "Mutated"}
						</Badge>
					</div>
					<div className="px-4 lg:px-6 py-4">
						<h4 className="text-base leading-none font-semibold mb-1">MGMT</h4>
						<Badge>{clinical.MGMT_Methylation}</Badge>
					</div>
					<div className="px-4 lg:px-6 py-4">
						<h4 className="text-base leading-none font-semibold mb-1">
							Prognostic
						</h4>
						<Badge
							className={
								clinical.prognosticScore >= 70
									? "bg-success"
									: clinical.prognosticScore >= 40
										? "bg-warning"
										: "bg-error"
							}
						>
							{clinical.prognosticScore}/100
						</Badge>
					</div>
				</div>
			</div>

			{/* Patient Tabs */}
			<Tabs
				onValueChange={setActiveTab}
				value={activeTab}
				className="w-full flex-col justify-start gap6"
			>
				<div className="flex items-center justify-between px-4 lg:px-6">
					<Label htmlFor="view-selector" className="sr-only">
						View
					</Label>
					<Select onValueChange={setActiveTab} value={activeTab}>
						<SelectTrigger
							className="flex w-fit @4xl/main:hidden"
							size="sm"
							id="view-selector"
						>
							<SelectValue placeholder="Select a view" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="clinical">Clinical Overview</SelectItem>
							<SelectItem value="molecular">Molecular Profile</SelectItem>
							<SelectItem value="network">Network Analysis</SelectItem>
							<SelectItem value="report">Comprehensive Report</SelectItem>
							{/* <SelectItem value="spoke">SPOKE Analysis</SelectItem> */}
							<SelectItem value="similar">Similar Patients</SelectItem>
						</SelectContent>
					</Select>
					<TabsList className="hidden @4xl/main:flex">
						<TabsTrigger value="clinical">Clinical Overview</TabsTrigger>
						<TabsTrigger value="molecular">Molecular Profile</TabsTrigger>
						<TabsTrigger value="network">Network Analysis</TabsTrigger>
						<TabsTrigger value="report">Comprehensive Report</TabsTrigger>
						{/* <TabsTrigger value="spoke">SPOKE Analysis</TabsTrigger> */}
						<TabsTrigger value="similar">Similar Patients</TabsTrigger>
					</TabsList>
				</div>
				<TabsContent value="clinical" className="flex flex-col px-4 lg:px-6">
					<Suspense fallback={<SkeletonCard />}>
						<ClinicalOverview
							clinical={clinical}
							treatmentsPromise={loaderData.treatments!}
						/>
					</Suspense>
				</TabsContent>
				<TabsContent value="molecular" className="flex flex-col px-4 lg:px-6">
					<Suspense fallback={<SkeletonCard />}>
						<MolecularProfile mutationsPromise={loaderData.molecular!} />
					</Suspense>
				</TabsContent>
				<TabsContent value="network" className="flex flex-col px-4 lg:px-6">
					<Suspense fallback={<SkeletonCard />}>
						<NetworkAnalysis />
					</Suspense>
				</TabsContent>
				<TabsContent value="report" className="flex flex-col px-4 lg:px-6">
					<Suspense fallback={<SkeletonCard />}>
						<ComprehensiveReport />
					</Suspense>
				</TabsContent>
				{/* <TabsContent value="spoke" className="flex flex-col px-4 lg:px-6">
					<div className="aspect-video w-full flex-1 rounded-lg border border-dashed">
						spoke
					</div>
				</TabsContent> */}
				<TabsContent value="similar" className="flex flex-col px-4 lg:px-6">
					<Suspense fallback={<SkeletonCard />}>
						<SimilarPatients />
					</Suspense>
				</TabsContent>
			</Tabs>
		</div>
	);
}
