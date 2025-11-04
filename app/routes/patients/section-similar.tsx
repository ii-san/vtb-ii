import { use } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	PolarAngleAxis,
	PolarGrid,
	Radar,
	RadarChart,
	XAxis,
	YAxis,
} from "recharts";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "~/components/ui/chart";
import { Progress } from "~/components/ui/progress";
import type {
	SimilarPatient,
	TherapyRecommendation,
} from "~/services/vtbService";
import type { Route } from "./+types/details";

interface SimilarPatientsProps {
	similarPromise: Route.ComponentProps["loaderData"]["similarPatients"];
}

function PatientSimilarityChart({ patients }: { patients: SimilarPatient[] }) {
	const similarityChartData = patients.slice(0, 8).map((patient) => ({
		// patient_id: patient.patient_id.substring(0, 10) + "...",
		patientId: patient.patient_id,
		overall: patient.overall_similarity,
		// dcna: patient.dcna_similarity,
		// mutation: patient.mutation_similarity,
		// clinical: patient.clinical_similarity,
		// network: patient.network_similarity,
	}));

	const chartConfig = {
		overall: {
			label: "Similarity",
			color: "var(--primary)",
		},
	} satisfies ChartConfig;

	return (
		<ChartContainer
			className="mx-auto aspect-video min-h-[150px] max-h-[300px]"
			config={chartConfig}
		>
			<BarChart accessibilityLayer data={similarityChartData}>
				<CartesianGrid vertical={false} />
				<XAxis dataKey="patientId" tickMargin={10} />
				<YAxis domain={[0, 1]} />
				<ChartTooltip
					cursor={false}
					content={
						<ChartTooltipContent
							formatter={(value) => [
								`${((value as number) * 100).toFixed(1)}% Similar`,
							]}
							hideLabel
						/>
					}
				/>
				<Bar dataKey="overall" fill="var(--color-overall)" radius={8} />
			</BarChart>
		</ChartContainer>
	);
}

function PatientProfileChart({
	patientSummary,
}: {
	patientSummary: {
		avg_dcna_similarity: number;
		avg_mutation_similarity: number;
		avg_clinical_similarity: number;
		avg_network_similarity: number;
	};
}) {
	const radarData = [
		{ metric: "DCNA Profile", similarity: patientSummary.avg_dcna_similarity },
		{ metric: "Mutations", similarity: patientSummary.avg_mutation_similarity },
		{ metric: "Clinical", similarity: patientSummary.avg_clinical_similarity },
		{ metric: "Network", similarity: patientSummary.avg_network_similarity },
	];

	const chartConfig = {
		similarity: {
			label: "Similarity",
			color: "var(--chart-2)",
		},
	} satisfies ChartConfig;

	return (
		<ChartContainer
			className="mx-auto aspect-video min-h-[150px] max-h-[300px]"
			config={chartConfig}
		>
			<RadarChart data={radarData}>
				<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
				<PolarAngleAxis dataKey="metric" />
				<PolarGrid />

				<Radar
					dataKey="similarity"
					fill="var(--color-similarity)"
					fillOpacity={0.6}
				/>
			</RadarChart>
		</ChartContainer>
	);
}

function TherapyChart({ therapies }: { therapies: TherapyRecommendation[] }) {
	const therapyData = therapies.slice(0, 10).map((therapy) => ({
		therapy_name:
			therapy.therapy_name.length > 15
				? `${therapy.therapy_name.substring(0, 15)}...`
				: therapy.therapy_name,
		score: therapy.recommendation_score,
		patients: therapy.supporting_patients,
		evidence: therapy.evidence_strength,
	}));

	const chartConfig = {
		score: {
			label: "Recommendation",
			color: "var(--primary)",
		},
	} satisfies ChartConfig;

	return (
		<ChartContainer
			className="mx-auto w-full min-h-[150px] max-h-[300px]"
			config={chartConfig}
		>
			<BarChart accessibilityLayer data={therapyData}>
				<CartesianGrid vertical={false} />
				<XAxis dataKey="therapy_name" tickMargin={10} />
				<YAxis domain={[0, 1]} />
				<ChartTooltip
					cursor={false}
					content={
						<ChartTooltipContent
							formatter={(value, name) => {
								if (name === "score")
									return [
										`${(value as number).toFixed(3)}`,
										"Recommendation Score",
									];
								if (name === "patients") return [value, "Supporting Patients"];
								return [value, name];
							}}
							hideLabel
						/>
					}
				/>
				<Bar dataKey="score" fill="var(--color-score)" radius={8} />
			</BarChart>
		</ChartContainer>
	);
}

function SimilarPatientTable({ patients }: { patients: SimilarPatient[] }) {
	return (
		<table className="table">
			<thead>
				<tr>
					<th>Patient ID</th>
					<th>Overall Similarity</th>
					<th>DCNA Profile</th>
					<th>Mutations</th>
					<th>Clinical</th>
					<th>Network</th>
					<th>Shared Mutations</th>
					<th>Similar Therapies</th>
				</tr>
			</thead>
			<tbody>
				{patients.map((patient, index) => (
					<tr key={index}>
						<td>
							<strong className="text-primary">{patient.patient_id}</strong>
						</td>
						<td>
							<Badge
								className={
									patient.overall_similarity >= 0.7
										? "bg-success"
										: patient.overall_similarity >= 0.5
											? "bg-warning"
											: "bg-secondary"
								}
							>
								{(patient.overall_similarity * 100).toFixed(1)}%
							</Badge>
						</td>
						<td>
							<Progress value={patient.dcna_similarity * 100} />
							<span className="progress-badge">
								{(patient.dcna_similarity * 100).toFixed(0)}%
							</span>
						</td>
						<td>
							<Progress value={patient.mutation_similarity * 100} />
							<span className="progress-badge">
								{(patient.mutation_similarity * 100).toFixed(0)}%
							</span>
						</td>
						<td>
							<Progress value={patient.clinical_similarity * 100} />
							<span className="progress-badge">
								{(patient.clinical_similarity * 100).toFixed(0)}%
							</span>
						</td>
						<td>
							<Progress value={patient.network_similarity * 100} />
							<span className="progress-badge">
								{(patient.network_similarity * 100).toFixed(0)}%
							</span>
						</td>
						<td>
							<Badge
								className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
								variant="secondary"
							>
								{patient.shared_mutations.length}
							</Badge>
							{patient.shared_mutations.length > 0 && (
								<small className="text-muted-foreground	">
									{patient.shared_mutations.slice(0, 3).join(", ")}
									{patient.shared_mutations.length > 3 && "..."}
								</small>
							)}
						</td>
						<td>
							<Badge
								className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
								variant="secondary"
							>
								{patient.similar_therapies.length}
							</Badge>
							{patient.similar_therapies.length > 0 && (
								<small className="text-muted-foreground">
									{patient.similar_therapies
										.slice(0, 2)
										.map((t) => t.therapy_name.substring(0, 10))
										.join(", ")}
									{patient.similar_therapies.length > 2 && "..."}
								</small>
							)}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

function SimilarPatients({ similarPromise }: SimilarPatientsProps) {
	// const analysisData = use(similarPromise);
	const {
		similar_patients,
		similarity_summary,
		therapy_recommendations,
		ai_assessment,
	} = use(similarPromise);
	return (
		<div>
			<div className="stats w-full bg-card text-card-foreground rounded-xl border shadow-sm mb-4">
				<div className="stat">
					<div className="stat-title">Similar Patients</div>
					<div className="stat-value">
						{similarity_summary.total_similar_patients}
					</div>
				</div>
				<div className="stat">
					<div className="stat-title">Average Similarity</div>
					<div className="stat-value">
						{(similarity_summary.avg_overall_similarity * 100).toFixed(1)}%
					</div>
				</div>
				<div className="stat">
					<div className="stat-title">Top Match</div>
					<div className="stat-value">
						{(similarity_summary.highest_similarity_score * 100).toFixed(1)}%
					</div>
				</div>
				<div className="stat">
					<div className="stat-title">Therapy Options</div>
					<div className="stat-value">{therapy_recommendations.length}</div>
				</div>
			</div>

			<div className="w-full mb-4">
				<Card>
					<CardHeader>
						<CardTitle>AI Assesment</CardTitle>
					</CardHeader>
					<CardContent>{ai_assessment}</CardContent>
				</Card>
			</div>

			<div className="w-full grid grid-cols-2 gap-4 mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Patient Similarity Comparison</CardTitle>
					</CardHeader>
					<CardContent>
						<PatientSimilarityChart patients={similar_patients} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Similarity Profile Analysis</CardTitle>
					</CardHeader>
					<CardContent>
						<PatientProfileChart patientSummary={similarity_summary} />
					</CardContent>
				</Card>
			</div>

			<div className="w-full mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Therapy Recommendations from Similar Patients</CardTitle>
					</CardHeader>
					<CardContent>
						<TherapyChart therapies={therapy_recommendations} />
					</CardContent>
				</Card>
			</div>

			<div className="w-full mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Similar Patients Details</CardTitle>
					</CardHeader>
					<CardContent className="overflow-x-auto">
						<SimilarPatientTable patients={similar_patients} />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default SimilarPatients;
