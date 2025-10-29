import { IconVirus } from "@tabler/icons-react";
import type * as React from "react";

import { NavDocuments } from "~/components/blocks/nav-documents";
import { NavMain } from "~/components/blocks/nav-main";
import { NavSecondary } from "~/components/blocks/nav-secondary";
import { NavUser } from "~/components/blocks/nav-user";
import logoLight from "~/components/layouts/logo-grey-black.svg";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "~/components/ui/sidebar";
import { RouteNav } from "~/routes";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:p-1.5!"
						>
							<a href="/">
								{/* <IconVirus className="size-5!" />
								<span className="text-base font-semibold">Sygnomics</span> */}
								<div className="w-[180px] flex-none p-2">
									<img
										src={logoLight}
										alt="Sygnomics Precision Oncology"
										className="block w-full"
									/>
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={RouteNav.navMain} />
				<NavDocuments items={RouteNav.documents} />
				{/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={RouteNav.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
