import { IconMinus, IconPlus } from "@tabler/icons-react";
import { DnaIcon, ExternalLinkIcon, Pill } from "lucide-react";
import { use } from "react";
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

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import type { ClinicalTrial, LiteratureSummary } from "~/services/vtbService";
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

function ComprehensiveReport({ reportPromise }: ComprehensiveReportProps) {
	const {
		patient_overview,
		timestamp,
		overall_confidence,
		prognosis_assessment,
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

			<div className="w-full grid grid-cols-2 gap-4 mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Top Ranked Drugs</CardTitle>
					</CardHeader>
					<CardContent>####</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Top Ranked Mutations</CardTitle>
					</CardHeader>
					<CardContent>####</CardContent>
				</Card>
			</div>

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

			<div className="w-full mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Scoring Methodology</CardTitle>
					</CardHeader>
					<CardContent>####</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default ComprehensiveReport;
