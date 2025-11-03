import { useState } from "react";
import { type UIMatch, useMatches, useNavigate } from "react-router";
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

interface pageMeta extends UIMatch {
	handle: {
		pageName: string;
	};
}

export function SiteHeader() {
	const [pageName, setPageName] = useState("Virtual Molecular Tumor Board");
	const currentPage = useMatches().pop() as pageMeta;
	const navigate = useNavigate();

	if (currentPage?.handle?.pageName) {
		setPageName(currentPage.handle.pageName);
	}

	const hackyPatientNav = (patientId: string) => {
		navigate(`/patients/${patientId}`);
	};

	return (
		<header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
			<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mx-2 data-[orientation=vertical]:h-4"
				/>
				<h1 className="text-base font-medium">{pageName}</h1>
				<div className="ml-auto flex items-center gap-2">
					{pageName === "Patient Details" && (
						<Select onValueChange={hackyPatientNav}>
							<SelectTrigger>
								<SelectValue placeholder="Change Patient" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="TN19-101604">TN19-101604</SelectItem>
								<SelectItem value="TN19-103432">TN19-103432</SelectItem>
								<SelectItem value="TN19-103433">TN19-103433</SelectItem>
								<SelectItem value="TN19-103434">TN19-103434</SelectItem>
								<SelectItem value="TN19-104496">TN19-104496</SelectItem>
							</SelectContent>
						</Select>
					)}
					{/* <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
						<a
							href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
							rel="noopener noreferrer"
							target="_blank"
							className="dark:text-foreground"
						>
							GitHub
						</a>
					</Button> */}
				</div>
			</div>
		</header>
	);
}
