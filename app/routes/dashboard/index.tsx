import { ChartAreaInteractive } from "~/components/blocks/chart-area-interactive";
import { DataTable } from "~/components/blocks/data-table";
import { SectionCards } from "~/components/blocks/section-cards";

import data from "~~/shad/dashboard/data.json";

export default function Page() {
	return (
		<>
			<SectionCards />
			<div className="px-4 lg:px-6">
				<ChartAreaInteractive />
			</div>
			<DataTable data={data} />
		</>
	);
}
