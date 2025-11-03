import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

function SimilarPatients() {
	return (
		<div>
			<div className="stats w-full bg-card text-card-foreground rounded-xl border shadow-sm mb-4">
				<div className="stat">
					<div className="stat-title">Similar Patients</div>
					<div className="stat-value"> </div>
				</div>
				<div className="stat">
					<div className="stat-title">Average Similarity</div>
					<div className="stat-value"> </div>
				</div>
				<div className="stat">
					<div className="stat-title">Top Match</div>
					<div className="stat-value"> </div>
				</div>
				<div className="stat">
					<div className="stat-title">Therapy Options</div>
					<div className="stat-value"> </div>
				</div>
			</div>

			<div className="w-full mb-4">
				<Card>
					<CardHeader>
						<CardTitle>AI Assesment</CardTitle>
					</CardHeader>
					<CardContent>####</CardContent>
				</Card>
			</div>

			<div className="w-full grid grid-cols-2 gap-4 mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Patient Similarity Comparison</CardTitle>
					</CardHeader>
					<CardContent>####</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Similarity Profile Analysis</CardTitle>
					</CardHeader>
					<CardContent>####</CardContent>
				</Card>
			</div>

			<div className="w-full mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Therapy Recommendations from Similar Patients</CardTitle>
					</CardHeader>
					<CardContent>####</CardContent>
				</Card>
			</div>

			<div className="w-full mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Similar Patients Details</CardTitle>
					</CardHeader>
					<CardContent>####</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default SimilarPatients;
