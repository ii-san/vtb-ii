import { use } from "react";
import { Badge } from "~/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import type { Mutation } from "~/services/patientService";
import type { Route } from "./+types/details";
import { DataTable } from "./mutations-table";

interface MutationProfileProps {
	mutationsPromise: Route.ComponentProps["loaderData"]["molecular"];
}

const keyGenes = [
	"TP53",
	"EGFR",
	"IDH1",
	"IDH2",
	"PTEN",
	"RB1",
	"CDKN2A",
	"MDM2",
	"MDM4",
	"PDGFRA",
];

function GlioblastomaTable({ mutations }: { mutations: Mutation[] }) {
	return (
		<table className="table table-sm">
			<thead>
				<tr>
					<th>Gene</th>
					<th>Status</th>
					<th>Protein Change</th>
					<th>Function Class</th>
					<th>Clinical Significance</th>
					<th>Therapeutic Implications</th>
				</tr>
			</thead>
			<tbody>
				{keyGenes.map((gene) => {
					const mutation = mutations.find((m) => m.Gene === gene);
					if (mutation) {
						return (
							<tr key={gene}>
								<td>
									<strong>{gene}</strong>
								</td>
								<td>
									<Badge className="bg-warning">Mutated</Badge>
								</td>
								<td>{mutation.Protein_Change}</td>
								<td>
									<Badge>{mutation.Function_Class}</Badge>
								</td>
								<td>
									{mutation.Clinical_Interpretation ? (
										<Badge>
											{mutation.Clinical_Interpretation.split(" - ")[0]}
										</Badge>
									) : (
										<span className="text-muted-foreground">Not specified</span>
									)}
								</td>
								<td className="text-muted-foreground	 small">
									{gene === "TP53" &&
										"Tumor suppressor loss, consider p53 pathway targeting"}
									{gene === "EGFR" && "Potential target for EGFR inhibitors"}
									{gene === "IDH1" &&
										"IDH inhibitors available for mutated cases"}
									{gene === "PTEN" && "PI3K/AKT pathway activation"}
									{!["TP53", "EGFR", "IDH1", "PTEN"].includes(gene) &&
										"Pathway analysis recommended"}
								</td>
							</tr>
						);
					} else {
						return (
							<tr key={gene} className="table-secondary">
								<td>
									<strong>{gene}</strong>
								</td>
								<td>
									<Badge color="success">Wild-type</Badge>
								</td>
								<td>-</td>
								<td>-</td>
								<td>
									<span className="text-muted-foreground">
										No mutation detected
									</span>
								</td>
								<td>
									<span className="text-muted-foreground">
										Standard pathway function assumed
									</span>
								</td>
							</tr>
						);
					}
				})}
			</tbody>
		</table>
	);
}

function MolecularProfile({ mutationsPromise }: MutationProfileProps) {
	const mutations = use(mutationsPromise);
	const significantMutations = mutations.filter(
		(m) =>
			m.Clinical_Interpretation &&
			m.Clinical_Interpretation !== "" &&
			(m.Function_Class === "Missense" ||
				m.Function_Class === "Nonsense" ||
				m.Function_Class === "Frameshift"),
	);

	const keyGeneMutations = mutations.filter((m) => keyGenes.includes(m.Gene));
	return (
		<div>
			<div className="stats w-full bg-card text-card-foreground rounded-xl border shadow-sm mb-4">
				<div className="stat">
					<div className="stat-title">Total Variants</div>
					<div className="stat-value">{mutations.length}</div>
				</div>
				<div className="stat">
					<div className="stat-title">Significant Mutations</div>
					<div className="stat-value">{significantMutations.length}</div>
				</div>
				<div className="stat">
					<div className="stat-title">Key Genes</div>
					<div className="stat-value">{keyGeneMutations.length}</div>
				</div>
				<div className="stat">
					<div className="stat-title">Missense Variants</div>
					<div className="stat-value">
						{mutations.filter((m) => m.Function_Class === "Missense").length}
					</div>
				</div>
			</div>

			<div className="w-full mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Key Glioblastoma Genes</CardTitle>
						<CardDescription>
							<strong>Note:</strong> These are the most commonly altered genes
							in glioblastoma. Mutations in these genes can affect prognosis and
							treatment selection.
						</CardDescription>
					</CardHeader>
					<CardContent className="overflow-x-auto">
						<GlioblastomaTable mutations={keyGeneMutations} />
					</CardContent>
				</Card>
			</div>

			<div className="w-full mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Complete Mutation Profile</CardTitle>
					</CardHeader>
					<CardContent>
						<DataTable data={mutations} />
					</CardContent>
				</Card>
			</div>

			<div className="w-full mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Molecular Summary</CardTitle>
						<CardDescription>Key Molecular Findings:</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="text-sm">
							<li>
								<strong>Total Variants:</strong> {mutations.length} variants
								identified across the genome
							</li>
							<li>
								<strong>Significant Mutations:</strong>{" "}
								{significantMutations.length} mutations with potential clinical
								significance
							</li>
							<li>
								<strong>IDH Status:</strong> Wild-type (typical of primary GBM)
							</li>
							<li>
								<strong>TP53 Status:</strong>{" "}
								{keyGeneMutations.find((m) => m.Gene === "TP53")
									? "Mutated (tumor suppressor loss)"
									: "Wild-type"}
							</li>
							<li>
								<strong>EGFR Status:</strong>{" "}
								{keyGeneMutations.find((m) => m.Gene === "EGFR")
									? "Mutated (potential therapeutic target)"
									: "Wild-type"}
							</li>
							<li>
								<strong>Treatment Implications:</strong> Molecular profile
								suggests{" "}
								{significantMutations.length > 2 ? "complex" : "standard"}{" "}
								therapeutic approach
							</li>
						</ul>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default MolecularProfile;
