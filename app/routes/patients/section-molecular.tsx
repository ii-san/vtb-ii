import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";

function MolecularProfile() {
	return (
		<div>
			<div className="stats w-full bg-card text-card-foreground rounded-xl border shadow-sm mb-4">
				<div className="stat">
					<div className="stat-title">Total Variants</div>
					<div className="stat-value"> </div>
				</div>
				<div className="stat">
					<div className="stat-title">Significant Mutations </div>
					<div className="stat-value"> </div>
				</div>
				<div className="stat">
					<div className="stat-title">Key Genes</div>
					<div className="stat-value"> </div>
				</div>
				<div className="stat">
					<div className="stat-title">Missense Variants</div>
					<div className="stat-value"> </div>
				</div>
			</div>

			<div className="w-full mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Key Glioblastoma Genes</CardTitle>
					</CardHeader>
					<CardContent>####</CardContent>
				</Card>
			</div>

			<div className="w-full mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Complete Mutation Profile</CardTitle>
					</CardHeader>
					<CardContent>####</CardContent>
				</Card>
			</div>

			<div className="w-full mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Clinical Summary</CardTitle>
						<CardDescription>Key Network Findings:</CardDescription>
					</CardHeader>
					<CardContent>
						{/* <ul>
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
						</ul> */}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default MolecularProfile;
