import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";

function NetworkAnalysis() {
	return (
		<div>
			<div className="stats w-full bg-card text-card-foreground rounded-xl border shadow-sm mb-4">
				<div className="stat">
					<div className="stat-title">Total Drugs Analyzed</div>
					<div className="stat-value"> </div>
					<div className="stat-desc">&nbsp;</div>
				</div>
				<div className="stat">
					<div className="stat-title">High SATGBM Score </div>
					<div className="stat-value"> </div>
					<div className="stat-desc">DCNA greater than .50</div>
				</div>
				<div className="stat">
					<div className="stat-title">Overactive Regulons</div>
					<div className="stat-value"> </div>
					<div className="stat-desc"> Total Regulons</div>
				</div>
				<div className="stat">
					<div className="stat-title">Underactive Regulons</div>
					<div className="stat-value"> </div>
					<div className="stat-desc"> Total Regulons</div>
				</div>
			</div>

			<div className="w-full grid grid-cols-3 gap-4 mb-4">
				<Card className="col-span-2">
					<CardHeader>
						<CardTitle>SATGBM Score Distribution</CardTitle>
					</CardHeader>
					<CardContent>####</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Regulon Activity Status</CardTitle>
					</CardHeader>
					<CardContent>####</CardContent>
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
					<CardContent>####</CardContent>
				</Card>
			</div>

			<div className="w-full mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Network Analysis Summary</CardTitle>
						<CardDescription>Key Network Findings:</CardDescription>
					</CardHeader>
					<CardContent>####</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default NetworkAnalysis;
