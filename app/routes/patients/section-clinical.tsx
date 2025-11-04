import { IconEyeTable } from "@tabler/icons-react";
import {
	DropletIcon,
	RadiationIcon,
	SliceIcon,
	TabletIcon,
} from "lucide-react";
import { use } from "react";
import { Badge } from "~/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import type { Treatment } from "~/services/vtbService";
import type { Route } from "./+types/details";

interface ClinicalOverviewProps {
	clinical: Route.ComponentProps["loaderData"]["clinical"];
	treatmentsPromise: Route.ComponentProps["loaderData"]["treatments"];
}

function RiskTable({
	patient,
}: {
	patient: Route.ComponentProps["loaderData"]["clinical"];
}) {
	const riskFactors = [
		{
			factor: "Age",
			value: `${Math.round(+patient.Age)} years`,
			risk: +patient.Age > 65 ? "High" : +patient.Age > 50 ? "Medium" : "Low",
		},
		{
			factor: "IDH Mutation Status",
			value: patient.IDH_Mutation === "wt" ? "Wild-type" : "Mutated",
			risk: patient.IDH_Mutation === "wt" ? "High" : "Low",
		},
		{
			factor: "MGMT Methylation",
			value: patient.MGMT_Methylation,
			risk: patient.MGMT_Methylation === "Methylated" ? "Low" : "High",
		},
		{
			factor: "Tumor Status",
			value: patient.Tumor_Status,
			risk: patient.Tumor_Status === "Recurrent" ? "High" : "Medium",
		},
	];
	return (
		<table className="table table-md">
			{/* head */}
			<thead>
				<tr>
					<th>Risk Factor</th>
					<th>Value</th>
					<th>Risk Level</th>
					<th>Clinical Significance</th>
				</tr>
			</thead>
			<tbody>
				{riskFactors.map((factor, index) => (
					<tr key={index}>
						<td>
							<strong>{factor.factor}</strong>
						</td>
						<td>{factor.value}</td>
						<td>
							<Badge
								className={
									{
										High: "bg-destructive",
										Medium: "bg-warning",
										Low: "bg-success",
									}[factor.risk] || "bg-secondary"
								}
							>
								{factor.risk}
							</Badge>
						</td>
						<td className="text-muted-foreground">
							{factor.factor === "Age" &&
								(factor.risk === "High"
									? "Advanced age associated with poorer prognosis"
									: "Age within favorable range")}
							{factor.factor === "IDH Mutation Status" &&
								(factor.risk === "Low"
									? "IDH mutation associated with better outcomes"
									: "Wild-type IDH associated with aggressive disease")}
							{factor.factor === "MGMT Methylation" &&
								(factor.risk === "Low"
									? "Methylated MGMT predicts TMZ response"
									: "Unmethylated MGMT associated with TMZ resistance")}
							{factor.factor === "Tumor Status" &&
								(factor.risk === "High"
									? "Recurrent disease has poor prognosis"
									: "Primary tumor, initial diagnosis")}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

function TreatmentTable({ treatments }: { treatments: Treatment[] }) {
	return (
		<table className="table table-md">
			<thead>
				<tr>
					<th>Order</th>
					<th>Treatment</th>
					<th>Type</th>
					<th>Drugs</th>
					{/* <th>Details</th> */}
				</tr>
			</thead>
			<tbody>
				{treatments.map((treatment) => (
					<tr key={treatment.treatment_id}>
						<td>#{treatment.treatment_order}</td>
						<td>
							<strong>{treatment.treatment_name}</strong>
						</td>
						<td>
							{{
								Surgery: (
									<Badge variant="secondary">
										<SliceIcon /> {treatment.treatment_type}
									</Badge>
								),
								Radiation: (
									<Badge variant="secondary">
										<RadiationIcon /> {treatment.treatment_type}
									</Badge>
								),
								Chemotherapy: (
									<Badge variant="secondary">
										<DropletIcon /> {treatment.treatment_type}
									</Badge>
								),
								"Clinical Trial": (
									<Badge variant="secondary">
										<IconEyeTable /> {treatment.treatment_type}
									</Badge>
								),
								"Device Therapy": (
									<Badge variant="secondary">
										<TabletIcon /> {treatment.treatment_type}
									</Badge>
								),
							}[treatment.treatment_type] || (
								<Badge variant="secondary">{treatment.treatment_type}</Badge>
							)}
						</td>
						<td>
							{treatment.drugs.length > 0 ? (
								<div>
									{treatment.drugs.map((drug, index) => (
										<Badge key={index} variant="outline" className="mx-1">
											{drug}
										</Badge>
									))}
								</div>
							) : (
								<span className="text-muted">No drugs</span>
							)}
						</td>
						{/* <td>
							<div>
								{treatment.is_trial && (
									<Badge variant="secondary">
										<IconEyeTable /> Clinical Trial
									</Badge>
								)}
								{treatment.is_surgery && (
									<Badge>
										<SliceIcon /> Surgery
									</Badge>
								)}
								{treatment.is_radiation && (
									<Badge>
										<RadiationIcon /> Radiation
									</Badge>
								)}
							</div>
						</td> */}
					</tr>
				))}
			</tbody>
		</table>
	);
}

function ClinicalOverview({
	clinical,
	treatmentsPromise,
}: ClinicalOverviewProps) {
	const { treatments, summary } = use(treatmentsPromise);
	return (
		<div>
			<div className="w-full grid grid-cols-6 gap-4 mb-4">
				<Card className="col-span-3">
					<CardHeader>
						<CardTitle>Demographics</CardTitle>
					</CardHeader>
					<CardContent>
						<p>
							<strong>Patient ID:</strong> {clinical.patient_id}
							<br />
							<strong>Gender:</strong> {clinical.Gender}
							<br />
							<strong>Age:</strong> {Math.floor(+clinical.Age)}
							<br />
							<strong>Race:</strong> {clinical.Race}
							<br />
							<strong>Ethnicity:</strong> {clinical.Ethnicity}
						</p>
					</CardContent>
				</Card>

				<Card className="col-span-3">
					<CardHeader>
						<CardTitle>Clinical Status</CardTitle>
					</CardHeader>
					<CardContent>
						<p>
							<strong>Diagnosis:</strong> {clinical.Diagnosis}
							<br />
							<strong>Tumor Status:</strong>{" "}
							<Badge
								className={
									clinical.Tumor_Status === "Primary" ? "bg-info" : "bg-warning"
								}
							>
								{clinical.Tumor_Status}
							</Badge>
							<br />
							<strong>Current Status:</strong>{" "}
							<Badge
								variant={
									clinical.Status === "Deceased" ? "destructive" : "default"
								}
							>
								{clinical.Status}
							</Badge>
							<br />
							<strong>Survival:</strong> {Math.round(+clinical.Survival!)}{" "}
							months
						</p>
					</CardContent>
				</Card>

				<Card className="col-span-4">
					<CardHeader>
						<CardTitle>Molecular Markers & Risk Assessment</CardTitle>
					</CardHeader>
					<CardContent className="overflow-x-auto">
						<RiskTable patient={clinical} />
					</CardContent>
				</Card>

				<Card className="col-span-2">
					<CardHeader>
						<CardTitle>Prognostic Score</CardTitle>
					</CardHeader>
					<CardContent className="text-center">
						<div className="stats">
							<div className="stat">
								{/* <div className="stat-title">Overall Score</div> */}
								<div className="stat-value">{clinical.prognosticScore}</div>
								<div className="stat-desc">Overall Score</div>
							</div>
						</div>
						<progress
							className={
								clinical.prognosticScore > 70
									? "progress progress-success w-full"
									: clinical.prognosticScore > 40
										? "progress progress-warning w-full"
										: "progress progress-error w-full"
							}
							value={clinical.prognosticScore}
							max="100"
						></progress>
						<div className="text-muted-foreground text-xs">
							<p>
								<strong>Score Calculation:</strong>
								<br />
								<strong>Base:</strong> 50 points
								<br />
								<strong>Age:</strong>{" "}
								{clinical.Age > 65 ? "-15" : clinical.Age > 50 ? "-8" : "0"}{" "}
								points
								<br />
								<strong>IDH:</strong>{" "}
								{clinical.IDH_Mutation !== "wt" ? "+20" : "0"} points
								<br />
								<strong>MGMT:</strong>{" "}
								{clinical.MGMT_Methylation === "Methylated" ? "+15" : "0"}{" "}
								points
								<br />
								<strong>Status:</strong>{" "}
								{clinical.Tumor_Status === "Recurrent" ? "-20" : "0"} points
							</p>
							<Separator className="mb-2 mt-2" />
							<div>
								<Badge variant="outline" className="text-error">
									0-39: Poor
								</Badge>
								<Badge variant="outline" className="mx-1 text-warning">
									40-69: Intermediate
								</Badge>
								<Badge variant="outline" className="mx-1 text-success">
									70-100: Favorable
								</Badge>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="w-full mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Treatment History</CardTitle>
					</CardHeader>
					<CardContent>
						{/* Treatment summary */}
						<div className="stats w-full bg-card text-card-foreground4">
							<div className="stat">
								<div className="stat-title">Chemotherapy</div>
								<div className="stat-value">
									{summary.chemotherapy_treatments}
								</div>
							</div>
							<div className="stat">
								<div className="stat-title">Radiation</div>
								<div className="stat-value">{summary.radiation_treatments}</div>
							</div>
							<div className="stat">
								<div className="stat-title">Surgeries</div>
								<div className="stat-value">{summary.surgeries}</div>
							</div>
							<div className="stat">
								<div className="stat-title">Clinical Trials</div>
								<div className="stat-value">{summary.clinical_trials}</div>
							</div>
							<div className="stat">
								<div className="stat-title">Device Therapy</div>
								<div className="stat-value">{summary.device_therapies}</div>
							</div>
							<div className="stat">
								<div className="stat-title">Unique Drugs</div>
								<div className="stat-value">{summary.unique_drug_count}</div>
							</div>
						</div>

						{/* Treatment Drug list */}
						<TreatmentTable treatments={treatments} />

						{/* Unique Drugs Summary */}
						{summary.unique_drugs.length > 0 && (
							<div className="mt-4">
								<h4 className="text-muted-foreground text-sm">
									All Drugs Used ({summary.unique_drug_count})
								</h4>
								<div>
									{summary.unique_drugs.map((drug, index) => (
										<Badge key={index} variant="outline" className="mx-1">
											{drug}
										</Badge>
									))}
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			<div className="w-full mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Clinical Summary</CardTitle>
						<CardDescription>Key Clincal Points</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="text-sm">
							<li>
								Patient is a {Math.floor(clinical.Age)}-year-old{" "}
								{clinical.Gender?.toLowerCase() || "unknown gender"} with{" "}
								{clinical.Diagnosis}
							</li>
							<li>Tumor status: {clinical.Tumor_Status}</li>
							<li>IDH wild-type status indicates aggressive disease biology</li>
							<li>
								MGMT {clinical.MGMT_Methylation?.toLowerCase() || "unknown"}{" "}
								status{" "}
								{clinical.MGMT_Methylation === "Methylated"
									? "suggests potential TMZ sensitivity"
									: "suggests limited TMZ benefit"}
							</li>
							<li>Overall survival: {clinical.Survival} months</li>
							<li>
								Prognostic score: {clinical.prognosticScore}/100 (
								{clinical.prognosticScore > 70
									? "Favorable"
									: clinical.prognosticScore > 40
										? "Intermediate"
										: "Poor"}{" "}
								prognosis)
							</li>
						</ul>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default ClinicalOverview;
