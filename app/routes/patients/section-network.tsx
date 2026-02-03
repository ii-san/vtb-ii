import { use } from "react";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from "recharts";
import { Badge } from "~/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "~/components/ui/chart";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";

import type { Route } from "./+types/details";

interface NetworkAnalysisProps {
	dcnaPromise: Route.ComponentProps["loaderData"]["networkData"]["dcna"];
	regulonsPromise: Route.ComponentProps["loaderData"]["networkData"]["regulon"];
}

function regulonReduce(regulons: RegulonActivity[]) {
	return regulons.reduce(
		(a, c) => {
			// Should always be Overactive | Normal | Underactive
			a[c.activity_status[0]]++;
			return a;
		},
		{ O: 0, N: 0, U: 0 },
	);
}

function DCNAHistogram({ dcna }: { dcna: DCNAData[] }) {
	const getBins = () => {
		const bins = [
			{ range: "< -0.5", count: 0 },
			{ range: "-0.5 to -0.25", count: 0 },
			{ range: "-0.25 to 0", count: 0 },
			{ range: "0 to 0.25", count: 0 },
			{ range: "0.25 to 0.5", count: 0 },
			{ range: "0.5 to 0.75", count: 0 },
			{ range: "> 0.75", count: 0 },
		];

		dcna.forEach((drug) => {
			const score = drug.dcna_score;
			if (score < -0.5) bins[0].count++;
			else if (score < -0.25) bins[1].count++;
			else if (score < 0) bins[2].count++;
			else if (score < 0.25) bins[3].count++;
			else if (score < 0.5) bins[4].count++;
			else if (score < 0.75) bins[5].count++;
			else bins[6].count++;
		});

		return bins;
	};

	const chartConfig = {
		count: {
			label: "# of Drugs",
			color: "var(--primary)",
		},
	} satisfies ChartConfig;

	return (
		<ChartContainer
			className="mx-auto aspect-video min-h-[150px] max-h-[300px]"
			config={chartConfig}
		>
			<BarChart accessibilityLayer data={getBins()}>
				<CartesianGrid vertical={false} />
				<XAxis dataKey="range" tickMargin={10} />
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent hideLabel />}
				/>
				<Bar dataKey="count" fill="var(--color-count)" radius={8} />
			</BarChart>
		</ChartContainer>
	);
}

function RegulonChart({ regulons }: { regulons: RegulonActivity[] }) {
	const summary = regulonReduce(regulons);
	const chartData = [
		{ name: "over", value: summary.O, fill: "var(--color-over)" },
		{ name: "norm", value: summary.N, fill: "var(--color-norm)" },
		{ name: "under", value: summary.U, fill: "var(--color-under)" },
	];
	const chartConfig = {
		name: {
			label: "Regulon Status",
		},
		over: {
			label: "Overactive",
			color: "var(--chart-1)",
		},
		under: {
			label: "Underactive",
			color: "var(--chart-2)",
		},
		norm: {
			label: "Normal",
			color: "var(--chart-3)",
		},
	} satisfies ChartConfig;
	return (
		<ChartContainer
			className="mx-auto aspect-square min-h-[150px] max-h-[300px]"
			config={chartConfig}
		>
			<PieChart>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent hideLabel />}
				/>
				<Pie data={chartData} dataKey="value" nameKey="name" innerRadius={40} />
				{/* <ChartLegend content={<ChartLegendContent />} /> */}
			</PieChart>
		</ChartContainer>
	);
}

function DrugTable({ dcna }: { dcna: DCNAData[] }) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Rank</TableHead>
					<TableHead className="w-[100px]">Drug Name</TableHead>
					<TableHead>SATGBM Score</TableHead>
					<TableHead>Target Gene</TableHead>
					<TableHead className="w-[100px]">Mechanism of Action</TableHead>
					<TableHead>Clinical Phase</TableHead>
					<TableHead>Approval Status</TableHead>
					<TableHead>Recommendation</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{dcna.map((drug, index) => (
					<TableRow key={index}>
						<TableCell className="text-right">{index + 1}</TableCell>
						<TableCell className="text-sm">{drug.drug_name}</TableCell>
						<TableCell>
							<Badge variant="outline">
								{Number(dcna[0].dcna_score).toFixed(3)}
							</Badge>
						</TableCell>
						<TableCell>
							<Badge>{drug.approved_symbol}</Badge>
						</TableCell>
						<TableCell className="text-sm">
							{drug.mechanism_of_action}
						</TableCell>
						<TableCell>
							<Badge
								variant="secondary"
								className={
									drug.clinical_phase === 4
										? "bg-success"
										: drug.clinical_phase >= 3
											? "bg-warning"
											: "bg-secondary"
								}
							>
								Phase {drug.clinical_phase}
							</Badge>
						</TableCell>
						<TableCell>
							<Badge
								variant="secondary"
								className={drug.is_approved ? "bg-success" : "bg-warning"}
							>
								{drug.is_approved ? "FDA Approved" : "Investigational"}
							</Badge>
						</TableCell>
						<TableCell>
							{drug.dcna_score > 0.7 && (
								<Badge variant="secondary" className="bg-success">
									High Priority
								</Badge>
							)}
							{drug.dcna_score > 0.5 && drug.dcna_score <= 0.7 && (
								<Badge variant="secondary" className="bg-warning">
									Medium Priority
								</Badge>
							)}
							{drug.dcna_score <= 0.5 && (
								<Badge variant="secondary" className="bg-secondary">
									Low Priority
								</Badge>
							)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

function NetworkAnalysis({
	dcnaPromise,
	regulonsPromise,
}: NetworkAnalysisProps) {
	const dcna = use(dcnaPromise);
	const regulons = use(regulonsPromise);
	const regSummary = regulonReduce(regulons);

	return (
		<div>
			{/* <div className="stats w-full bg-base-100 border-base-300 border shadow"> */}
			<div className="stats w-full bg-card text-card-foreground rounded-xl border shadow-sm mb-4">
				<div className="stat">
					<div className="stat-title">Total Drugs Analyzed</div>
					<div className="stat-value">{dcna.length}</div>
					<div className="stat-desc">&nbsp;</div>
				</div>
				<div className="stat">
					<div className="stat-title">High SATGBM Score </div>
					<div className="stat-value">
						{dcna.filter((d) => d.dcna_score > 0.5).length}
					</div>
					<div className="stat-desc">DCNA greater than .50</div>
				</div>
				<div className="stat">
					<div className="stat-title">Overactive Regulons</div>
					<div className="stat-value">
						{regulons.filter((r) => r.activity_status === "Overactive").length}
					</div>
					<div className="stat-desc">{regulons.length} Total Regulons</div>
				</div>
				<div className="stat">
					<div className="stat-title">Underactive Regulons</div>
					<div className="stat-value">
						{regulons.filter((r) => r.activity_status === "Underactive").length}
					</div>
					<div className="stat-desc">{regulons.length} Total Regulons</div>
				</div>
			</div>

			<div className="w-full grid grid-cols-3 gap-4 mb-4">
				<Card className="col-span-2">
					<CardHeader>
						<CardTitle>SATGBM Score Distribution</CardTitle>
					</CardHeader>
					<CardContent>
						<DCNAHistogram dcna={dcna} />
					</CardContent>
					<CardFooter className="flex-col items-start gap-2 text-sm">
						{/* SATGBM (Sygnomics Analytics Test for GBM): Uses Systems Genetic
						Network Analysis of transcriptomic data to build disease network
						maps and predict patient-specific disease progression risk and
						therapy recommendations. Values closer to +1 indicate higher
						predicted efficacy; values closer to -1 indicate lower predicted
						benefit. */}
					</CardFooter>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Regulon Activity Status</CardTitle>
					</CardHeader>
					<CardContent>
						<RegulonChart regulons={regulons} />
					</CardContent>
					<CardFooter className="flex-col items-start gap-2 text-sm">
						&nbsp;
					</CardFooter>
				</Card>
			</div>

			<div className="w-full mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Top 10 Drug Recommendations by SATGBM Score</CardTitle>
						<CardDescription>
							<strong>Recommendation Priority:</strong> Drugs are ranked by
							SATGBM score using Systems Genetic Network Analysis. Higher scores
							indicate greater predicted therapeutic efficacy based on the
							patient's molecular profiling data and disease network map.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<DrugTable dcna={dcna.slice(0, 10)} />
					</CardContent>
				</Card>
			</div>

			<div className="w-full mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Network Analysis Summary</CardTitle>
						<CardDescription>Key Network Findings:</CardDescription>
					</CardHeader>
					<CardContent>
						<ul>
							<li>
								<strong>Drug Activity Profile:</strong>
								{dcna.filter((d) => d.dcna_score > 0.5).length} drugs show high
								predicted activity (DCNA &gt; 0.5)
							</li>
							<li>
								<strong>Top Recommendation:</strong> {dcna[0].drug_name} with
								DCNA score of {Number(dcna[0].dcna_score).toFixed(3)}
							</li>
							<li>
								<strong>Regulon Activity:</strong>
								{regSummary.O} overactive,
								{regSummary.N} normal,
								{regSummary.U} underactive regulons
							</li>
							<li>
								<strong>Therapeutic Strategy:</strong> Network analysis suggests
								focusing on
								{dcna
									.slice(0, 3)
									.map((d) => d.approved_symbol)
									.join(", ")}{" "}
								pathway targeting
							</li>
							<li>
								<strong>Clinical Trial Eligibility:</strong> Patient may be
								eligible for trials involving top-ranked investigational agents
							</li>
							<li>
								<strong>Personalized Approach:</strong> Network-based ranking
								prioritizes drugs most likely to be effective for this patient's
								molecular profile
							</li>
						</ul>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default NetworkAnalysis;
