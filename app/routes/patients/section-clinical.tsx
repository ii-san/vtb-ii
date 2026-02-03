import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";

function ClinicalOverview() {
	return (
		<div>
			<div className="w-full grid grid-cols-6 gap-4 mb-4">
				<Card className="col-span-3">
					<CardHeader>
						<CardTitle>Demographics</CardTitle>
					</CardHeader>
					<CardContent>####</CardContent>
				</Card>

				<Card className="col-span-3">
					<CardHeader>
						<CardTitle>Clinical Status</CardTitle>
					</CardHeader>
					<CardContent>####</CardContent>
				</Card>

				<Card className="col-span-4">
					<CardHeader>
						<CardTitle>Molecular Markers & Risk Assessment</CardTitle>
					</CardHeader>
					<CardContent>####</CardContent>
				</Card>
				<Card className="col-span-2">
					<CardHeader>
						<CardTitle>Prognostic Score</CardTitle>
					</CardHeader>
					<CardContent>####</CardContent>
				</Card>
			</div>

			<div className="w-full mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Treatment History</CardTitle>
					</CardHeader>
					<CardContent>####</CardContent>
				</Card>
			</div>

			<div className="w-full mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Clinical Summary</CardTitle>
						<CardDescription>Key Clincal Points</CardDescription>
					</CardHeader>
					<CardContent>####</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default ClinicalOverview;
