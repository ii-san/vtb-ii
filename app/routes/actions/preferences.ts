import { type ActionFunctionArgs, data } from "react-router";
import { commitSession, getSession } from "~/sessions.server";

export const action = async ({ request }: ActionFunctionArgs) => {
	const { theme } = await request.json();
	const session = await getSession(request.headers.get("Cookie"));

	if (theme === "light" || theme === "dark") {
		session.set("theme", theme);
	}

	if (theme === "system") {
		session.unset("theme");
	}

	return data(null, {
		headers: { "Set-Cookie": await commitSession(session) },
	});
};
