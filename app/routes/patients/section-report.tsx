import { IconMinus, IconPlus } from "@tabler/icons-react";
import { DnaIcon, ExternalLinkIcon, Pill } from "lucide-react";
import { use, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import type {
	ClinicalTrial,
	DrugScore,
	LiteratureSummary,
	MutationScore,
} from "~/services/vtbService";
import type { Route } from "./+types/details";

interface ComprehensiveReportProps {
	reportPromise: Route.ComponentProps["loaderData"]["patientReport"];
}

function ClinicalTrialsTable({ trials }: { trials: ClinicalTrial[] }) {
	return (
		<Table>
			<TableCaption>
				<strong>Note:</strong> Clinical trials are matched to the top 20
				recommended drugs. Visit{" "}
				<a
					href="https://clinicaltrials.gov"
					target="_blank"
					rel="noopener noreferrer"
				>
					ClinicalTrials.gov
				</a>{" "}
				for complete trial information and eligibility criteria.
			</TableCaption>

			<TableHeader>
				<TableRow>
					<TableHead>Title</TableHead>
					<TableHead>Drug</TableHead>
					<TableHead>Phase</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Enrollment</TableHead>
					<TableHead>Action</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{trials.map((trial, index) => (
					<TableRow key={index}>
						<TableCell>
							<strong className="text-primary">{trial.nct_id}</strong>
							<div className="text-wrap">{trial.title}</div>
							<small className="text-muted-foreground mt-1">
								{trial.indication}
							</small>
						</TableCell>
						<TableCell>
							<Badge variant="outline">{trial.drug_name}</Badge>
						</TableCell>
						<TableCell>
							<Badge
								variant="outline"
								className={
									{
										PHASE3: "bg-success",
										PHASE2: "bg-warning",
										PHASE1: "bc-info",
									}[trial.phase] || "bg-secondary"
								}
							>
								{trial.phase}
							</Badge>
						</TableCell>
						<TableCell>
							<Badge
								variant="secondary"
								className={
									{
										RECRUITING: "bg-success",
										ACTIVE: "bg-warning",
										COMPLETED: "bc-info",
									}[trial.status] || "bg-secondary"
								}
							>
								{trial.status}
							</Badge>
						</TableCell>
						<TableCell>
							<span className="badge bg-light text-dark">
								{trial.enrollment}
							</span>
						</TableCell>
						<TableCell>
							<Button variant="outline" asChild>
								<a href={trial.url} target="_blank" rel="noopener noreferrer">
									<ExternalLinkIcon />
									View
								</a>
							</Button>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

function RecentLiteratureTable({ articles }: { articles: LiteratureSummary }) {
	return (
		<Table>
			<TableCaption>
				<strong>Note:</strong> Literature is sourced from PubMed using real API
				queries. Articles are filtered for GBM/glioblastoma relevance and
				limited to the last 5 years. Visit{" "}
				<a
					href="https://pubmed.ncbi.nlm.nih.gov"
					target="_blank"
					rel="noopener noreferrer"
				>
					PubMed
				</a>{" "}
				for complete search results.
			</TableCaption>

			<TableHeader>
				<TableRow>
					<TableHead>Title</TableHead>
					<TableHead>Focus</TableHead>
					<TableHead>Authors</TableHead>
					<TableHead>Journal</TableHead>
					<TableHead>Date</TableHead>
					<TableHead>Action</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{/* Drug Articles */}
				{Object.entries(articles.drug_literature).map(([drug, articleList]) =>
					articleList.slice(0, 3).map((article) => (
						<TableRow key={article.pmid}>
							<TableCell>
								<strong className="text-primary">{article.pmid}</strong>
								<div className="text-wrap">{article.title}</div>
								{/* <small className="text-muted-foreground mt-1">
								{trial.indication}
							</small> */}
							</TableCell>
							<TableCell>
								<Badge variant="outline">
									<Pill />
									{drug}
								</Badge>
							</TableCell>
							<TableCell>
								{article.authors
									? article.authors.split(",").slice(0, 2).join(", ") +
										(article.authors.split(",").length > 2 ? ", et al." : "")
									: "N/A"}
							</TableCell>
							<TableCell>
								<div className="text-wrap">
									{article.publication_info || article.source || "N/A"}
								</div>
							</TableCell>
							<TableCell>{article.pubdate || "N/A"}</TableCell>
							<TableCell>
								<Button variant="outline" asChild>
									<a
										href={article.url}
										target="_blank"
										rel="noopener noreferrer"
									>
										<ExternalLinkIcon />
										View
									</a>
								</Button>
							</TableCell>
						</TableRow>
					)),
				)}
				{/* Gene Articles */}
				{Object.entries(articles.mutation_literature).map(
					([gene, articleList]) =>
						articleList.slice(0, 3).map((article) => (
							<TableRow key={article.pmid}>
								<TableCell>
									<strong className="text-primary">{article.pmid}</strong>
									<div className="text-wrap">{article.title}</div>
									{/* <small className="text-muted-foreground mt-1">
								{trial.indication}
							</small> */}
								</TableCell>
								<TableCell>
									<Badge variant="outline">
										<DnaIcon />
										{gene}
									</Badge>
								</TableCell>
								<TableCell>
									{article.authors
										? article.authors.split(",").slice(0, 2).join(", ") +
											(article.authors.split(",").length > 2 ? ", et al." : "")
										: "N/A"}
								</TableCell>
								<TableCell>
									<div className="text-wrap">
										{article.publication_info || article.source || "N/A"}
									</div>
								</TableCell>
								<TableCell>{article.pubdate || "N/A"}</TableCell>
								<TableCell>
									<Button variant="outline" asChild>
										<a
											href={article.url}
											target="_blank"
											rel="noopener noreferrer"
										>
											<ExternalLinkIcon />
											View
										</a>
									</Button>
								</TableCell>
							</TableRow>
						)),
				)}
			</TableBody>
		</Table>
	);
}

function DrugRankTable({ drugs }: { drugs: DrugScore[] }) {
	const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
	const toggleRowExpansion = (index: number) => {
		const newExpandedRows = new Set(expandedRows);
		if (newExpandedRows.has(index)) {
			newExpandedRows.delete(index);
		} else {
			newExpandedRows.add(index);
		}
		setExpandedRows(newExpandedRows);
	};

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead></TableHead>
					<TableHead>Drug</TableHead>
					<TableHead>Score</TableHead>
					<TableHead>SATGBM</TableHead>
					<TableHead>Details</TableHead>
				</TableRow>
			</TableHeader>
			{drugs.map((drug) => (
				<TableBody key={drug.rank}>
					<TableRow
						className="cursor-pointer"
						onClick={() => toggleRowExpansion(drug.rank)}
					>
						<TableCell>{drug.rank}</TableCell>
						<TableCell>
							<strong className="text-wrap">{drug.drug_name}</strong>
						</TableCell>
						<TableCell>
							<Badge variant="secondary">
								{(drug.total_score || 0).toFixed(3)}
							</Badge>
						</TableCell>
						<TableCell>
							<Badge variant="outline">
								{(drug.dcna_score || 0).toFixed(3)}
							</Badge>
						</TableCell>
						<TableCell>
							<Button
								variant="secondary"
								onClick={() => toggleRowExpansion(drug.rank)}
							>
								{expandedRows.has(drug.rank) ? <IconMinus /> : <IconPlus />}
							</Button>
						</TableCell>
					</TableRow>
					<TableRow hidden={!expandedRows.has(drug.rank)}>
						<TableCell colSpan={5} className="bg-muted/50 border-b border-t-0">
							<div className="mb-2">
								<small>
									<strong>Scoring Breakdown:</strong>
								</small>
								<div className="flex flex-wrap gap-1">
									<Badge variant="outline">
										Molecular: {(drug.molecular_profile_score || 0).toFixed(2)}
									</Badge>
									<Badge variant="outline">
										Biomarker: {(drug.biomarker_score || 0).toFixed(2)}
									</Badge>
									<Badge variant="outline">
										Clinical: {(drug.clinical_evidence_score || 0).toFixed(2)}
									</Badge>
									<Badge variant="outline">
										Mechanism: {(drug.mechanism_score || 0).toFixed(2)}
									</Badge>
									<Badge variant="outline">
										Admin: {(drug.administration_score || 0).toFixed(2)}
									</Badge>
								</div>
							</div>
							<div className="text-wrap text-xs">
								<strong>Rationale:</strong> {drug.rationale}
							</div>
						</TableCell>
					</TableRow>
				</TableBody>
			))}
		</Table>
	);
}

function MutationRankTable({ mutations }: { mutations: MutationScore[] }) {
	const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
	const toggleRowExpansion = (index: number) => {
		const newExpandedRows = new Set(expandedRows);
		if (newExpandedRows.has(index)) {
			newExpandedRows.delete(index);
		} else {
			newExpandedRows.add(index);
		}
		setExpandedRows(newExpandedRows);
	};

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead></TableHead>
					<TableHead>Gene</TableHead>
					<TableHead>Score</TableHead>
					<TableHead>Clincal</TableHead>
					<TableHead>Details</TableHead>
				</TableRow>
			</TableHeader>
			{mutations.map((mutation) => (
				<TableBody key={mutation.rank}>
					<TableRow
						className="cursor-pointer"
						onClick={() => toggleRowExpansion(mutation.rank)}
					>
						<TableCell>{mutation.rank}</TableCell>
						<TableCell>
							<div className="flex">
								<strong>{mutation.gene}</strong>
								<Separator
									orientation="vertical"
									className="mx-2 data-[orientation=vertical]:h-4"
								/>
								<span className="text-muted-foreground">
									{mutation.mutation}
								</span>
							</div>
						</TableCell>
						<TableCell>
							<Badge variant="secondary">
								{(mutation.total_score || 0).toFixed(3)}
							</Badge>
						</TableCell>
						<TableCell>
							<Badge variant="outline">
								{(mutation.clinical_score || 0).toFixed(3)}
							</Badge>
						</TableCell>
						<TableCell>
							<Button
								variant="secondary"
								onClick={() => toggleRowExpansion(mutation.rank)}
							>
								{expandedRows.has(mutation.rank) ? <IconMinus /> : <IconPlus />}
							</Button>
						</TableCell>
					</TableRow>
					<TableRow hidden={!expandedRows.has(mutation.rank)}>
						<TableCell colSpan={5} className="bg-muted/50 border-b border-t-0">
							<div className="mb-2">
								<small>
									<strong>Scoring Breakdown:</strong>
								</small>
								<div className="flex flex-wrap gap-1">
									<Badge variant="outline">
										Prevalence: {(mutation.prevalence_score || 0).toFixed(2)}
									</Badge>
									<Badge variant="outline">
										Therapeutic: {(mutation.therapeutic_score || 0).toFixed(2)}
									</Badge>
									<Badge variant="outline">
										Biomarker: {(mutation.biomarker_score || 0).toFixed(2)}
									</Badge>
									<Badge variant="outline">
										Clinical:{" "}
										{(mutation.clinical_evidence_score || 0).toFixed(2)}
									</Badge>
									<Badge variant="outline">
										Mechanism: {(mutation.mechanism_score || 0).toFixed(2)}
									</Badge>
									<Badge variant="outline">
										Prognostic: {(mutation.prognostic_score || 0).toFixed(2)}
									</Badge>
								</div>
							</div>
							<div className="text-wrap text-xs">
								<p>
									<strong>Rationale:</strong> {mutation.rationale}
								</p>
								{mutation.clinical_interpretation && (
									<p>
										<strong>Clinical Interpretation:</strong>{" "}
										{mutation.clinical_interpretation}
									</p>
								)}
							</div>
						</TableCell>
					</TableRow>
				</TableBody>
			))}
		</Table>
	);
}

function ComprehensiveReport({ reportPromise }: ComprehensiveReportProps) {
	const {
		patient_overview,
		timestamp,
		overall_confidence,
		prognosis_assessment,
		ranked_drugs,
		ranked_mutations,
		clinical_trials,
		literature_summary,
	} = use(reportPromise);
	return (
		<div>
			{/* <div className="w-full mb-4">
				<Card>
					<CardHeader>
						<CardTitle>AI Executive Summary</CardTitle>
					</CardHeader>
					<CardContent>####</CardContent>
				</Card>
			</div> */}

			{/* Patient Overview */}
			<div className="w-full mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Patient Overview</CardTitle>
					</CardHeader>
					<CardContent>{patient_overview}</CardContent>
					<CardFooter>
						<div className="w-full grid grid-cols-3 gap-4 text-sm">
							<div>
								<span className="text-muted-foreground mx-1">
									Overall Confidence:
								</span>
								<Badge>{(overall_confidence * 100).toFixed(0)}%</Badge>
							</div>
							<div>
								<span className="text-muted-foreground mx-1">Report Date:</span>
								{new Date(timestamp).toLocaleString()}
							</div>
							<div>
								<span className="text-muted-foreground mx-1">
									Report Version:
								</span>
								AA v1.0.1
							</div>
						</div>
					</CardFooter>
				</Card>
			</div>

			{/* Prognisis Assesment*/}
			<div className="w-full mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Prognosis Assesment</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="w-full grid grid-cols-4 gap-4 text-sm">
							<div>
								<div className="leading-none font-semibold">Risk Category</div>
								<p>{prognosis_assessment.risk_category}</p>
							</div>
							<div>
								<div className="leading-none font-semibold">
									Prognosis Score
								</div>
								<p>{(prognosis_assessment.prognosis_score || 0).toFixed(2)}</p>
							</div>
							<div>
								<div className="leading-none font-semibold">
									Estimated Survival
								</div>
								<p>{prognosis_assessment.estimated_survival}</p>
							</div>
							<div>
								<div className="leading-none font-semibold">Key Biomarkers</div>
								<Badge className="mx-1 mb-1">
									IDH: {prognosis_assessment.key_biomarkers.idh_status}
								</Badge>
								<Badge>
									MGMT: {prognosis_assessment.key_biomarkers.mgmt_status}
								</Badge>
							</div>

							<div className="col-span-2">
								<div className="leading-none font-semibold">
									Favorable Factors
								</div>
								<ul>
									{prognosis_assessment.favorable_factors.map(
										(factor, index) => (
											<li key={index}>
												<Badge className="mx-1 mb-1" variant="secondary">
													<IconPlus />
												</Badge>
												{factor}
											</li>
										),
									)}
								</ul>
							</div>

							<div className="col-span-2">
								<div className="leading-none font-semibold">
									Adverse Factors
								</div>
								<ul className="list-unstyled">
									{prognosis_assessment.adverse_factors.map((factor, index) => (
										<li key={index}>
											<Badge className="mx-1 mb-1" variant="secondary">
												<IconMinus />
											</Badge>
											{factor}
										</li>
									))}
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Ranked Drug and Mutations */}
			<div className="w-full grid grid-cols-2 gap-4 mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Top Ranked Drugs</CardTitle>
					</CardHeader>
					<CardContent>
						<DrugRankTable drugs={ranked_drugs.slice(0, 20)} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Top Ranked Mutations</CardTitle>
					</CardHeader>
					<CardContent>
						<MutationRankTable mutations={ranked_mutations.slice(0, 20)} />
					</CardContent>
				</Card>
			</div>

			{/* Clinical Trials */}
			{clinical_trials && clinical_trials.length > 0 && (
				<div className="w-full mb-4">
					<Card>
						<CardHeader>
							<CardTitle>Clinical Trials</CardTitle>
							<CardDescription className="stats">
								<div className="stat">
									<div className="stat-title">Phase 3 Trials</div>
									<div className="stat-value">
										{
											clinical_trials.filter((t) => t.phase === "Phase 3")
												.length
										}
									</div>
								</div>
								<div className="stat">
									<div className="stat-title">Recruiting</div>
									<div className="stat-value">
										{
											clinical_trials.filter((t) => t.status === "Recruiting")
												.length
										}
									</div>
								</div>
								<div className="stat">
									<div className="stat-title">Unique Drugs</div>
									<div className="stat-value">
										{new Set(clinical_trials.map((t) => t.drug_name)).size}
									</div>
								</div>
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ClinicalTrialsTable trials={clinical_trials} />
						</CardContent>
					</Card>
				</div>
			)}

			{/* Literature Summary */}
			{literature_summary && (
				<div className="w-full mb-4">
					<Card>
						<CardHeader>
							<CardTitle>Recent Literature</CardTitle>
							<CardDescription className="stats">
								<div className="stat">
									<div className="stat-title">Drug Literature:</div>
									<div className="stat-value">
										{literature_summary.summary_stats.total_drug_articles}
									</div>
									<div className="stat-desc">articles</div>
								</div>
								<div className="stat">
									<div className="stat-title">Mutation Literature</div>
									<div className="stat-value">
										{literature_summary.summary_stats.total_mutation_articles}
									</div>
									<div className="stat-desc">articles</div>
								</div>
								<div className="stat">
									<div className="stat-title">Drugs with Literature:</div>
									<div className="stat-value">
										{literature_summary.summary_stats.drugs_with_literature}
									</div>
									<div className="stat-desc">
										of {literature_summary.summary_stats.drugs_searched} drugs
										searched
									</div>
								</div>
								<div className="stat">
									<div className="stat-title">Genes with Literature:</div>
									<div className="stat-value">
										{literature_summary.summary_stats.genes_with_literature}
									</div>
									<div className="stat-desc">
										of {literature_summary.summary_stats.genes_searched} genes
										searched
									</div>
								</div>
							</CardDescription>
						</CardHeader>
						<CardContent>
							<RecentLiteratureTable articles={literature_summary} />
						</CardContent>
					</Card>
				</div>
			)}

			{/* Scoring Methodology */}
			<div className="w-full mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Scoring Methodology</CardTitle>
					</CardHeader>
					<CardContent className="w-full grid grid-cols-2 text-sm">
						<div>
							<h6 className="leading-none font-semibold mb-2">
								Drug Scoring Factors (7-Factor System)
							</h6>
							<ul className="**:data-[slot=badge]:bg-muted-foreground/30  **:data-[slot=badge]:px-1">
								<li>
									<Badge>25%</Badge> SATGBM Score - Systems Genetic Network
									Analysis for disease progression risk and therapy prediction
								</li>
								<li>
									<Badge>20%</Badge> Molecular Profile Match - Patient mutation
									alignment
								</li>
								<li>
									<Badge>15%</Badge> Biomarker Status - MGMT/IDH relevance
								</li>
								<li>
									<Badge>15%</Badge> Clinical Evidence - Trial data quality
								</li>
								<li>
									<Badge>12%</Badge> Mechanism of Action - GBM relevance
								</li>
								<li>
									<Badge>8%</Badge> Administration - BBB penetration
								</li>
								<li>
									<Badge>5%</Badge> Drug Interactions - Safety profile
								</li>
							</ul>
						</div>
						<div>
							<h6 className="leading-none font-semibold mb-2">
								Mutation Scoring Factors (6-Factor System)
							</h6>
							<ul className="**:data-[slot=badge]:bg-primary  **:data-[slot=badge]:px-1">
								<li>
									<Badge>40%</Badge> Clinical Interpretation - Pathogenic/VUS
									classification
								</li>
								<li>
									<Badge>15%</Badge> Mutation Prevalence - Frequency in GBM
								</li>
								<li>
									<Badge>12%</Badge> Therapeutic Implications - Treatment impact
								</li>
								<li>
									<Badge>9%</Badge> Biomarker Status - Clinical relevance
								</li>
								<li>
									<Badge>9%</Badge> Clinical Evidence - Research support
								</li>
								<li>
									<Badge>7.2%</Badge> Mechanism of Action - Tumor biology impact
								</li>
								<li>
									<Badge>7.8%</Badge> Prognostic Value - Survival association
								</li>
							</ul>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default ComprehensiveReport;
