import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function ThemeToggle() {
	const [theme, setTheme] = useState("");

	useEffect(() => {
		const savePreferences = async ({ theme }: { theme: string }) => {
			try {
				await fetch(`/api/settings`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ theme }),
				});
				return theme;
			} catch (error) {
				console.error("Error saving preferences:", error);
			}
		};

		savePreferences({ theme }).then((theme) => {
			const themeData = window.document.documentElement.dataset;
			const tql = window.matchMedia("(prefers-color-scheme: light)");

			if (theme === "system") {
				const systemTheme = tql.matches ? "light" : "dark";
				themeData.themeControl = "SYSTEM";
				themeData.theme = systemTheme;
			}
			if (theme === "light" || theme === "dark") {
				themeData.themeControl = "USER";
				themeData.theme = theme;
			}
		});
	}, [theme]);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
					<Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme("light")}>
					Light
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
