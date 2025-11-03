import { Link } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";

import data from "~~/patients/clinical.json";

export const handle = {
	pageName: "Patients",
};

export default function Page() {
	return (
		<div className="px-4 lg:px-6 py-4">
			<Table>
				<TableCaption>Current patients with profiles.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">Patient</TableHead>
						<TableHead className="text-right">Age</TableHead>
						<TableHead className="text-right">Gender</TableHead>
						<TableHead className="text-right">Status</TableHead>
						<TableHead className="text-right">Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((patient) => (
						<TableRow key={patient.patient_id}>
							<TableCell className=" font-medium">
								{patient.patient_id}
								<br />
								{patient.Diagnosis}
							</TableCell>
							<TableCell className="text-right">
								{Math.floor(+patient.Age)}
							</TableCell>
							<TableCell className="text-right">{patient.Gender}</TableCell>
							<TableCell className="text-right">
								<Badge
									variant={
										patient.Status === "Deceased" ? "destructive" : "default"
									}
								>
									{patient.Status}
								</Badge>
							</TableCell>
							<TableCell className="text-right">
								<Button asChild>
									<Link to={`/patients/${patient.patient_id}`}>Details</Link>
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
