import { Outlet } from "react-router";
import { AppSidebar } from "~/components/blocks/app-sidebar";
import { SiteHeader } from "~/components/blocks/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

export default function Page() {
	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 72)",
					"--header-height": "calc(var(--spacing) * 12)",
				} as React.CSSProperties
			}
		>
			<AppSidebar variant="inset" />
			<SidebarInset>
				<SiteHeader />
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
}
