import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

function ComprehensiveReport() {
	return (
		<div>
			<div className="w-full mb-4">
				<Card>
					<CardHeader>
						<CardTitle>AI Executive Summary</CardTitle>
					</CardHeader>
					<CardContent>####</CardContent>
				</Card>
			</div>

			<div className="w-full mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Patient Overview</CardTitle>
					</CardHeader>
					<CardContent>####</CardContent>
				</Card>
			</div>

			<div className="w-full mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Prognosis Assesment</CardTitle>
					</CardHeader>
					<CardContent>####</CardContent>
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

			<div className="w-full mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Clinical Trials</CardTitle>
					</CardHeader>
					<CardContent>####</CardContent>
				</Card>
			</div>

			<div className="w-full mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Recent Literature</CardTitle>
					</CardHeader>
					<CardContent>####</CardContent>
				</Card>
			</div>

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
