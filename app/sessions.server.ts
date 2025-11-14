import { createCookieSessionStorage } from "react-router";

const isProduction = process.env.NODE_ENV === "production";

type SessionData = {
	theme?: string;
};

type SessionFlashData = {
	error: string;
};

const { getSession, commitSession, destroySession } =
	createCookieSessionStorage<SessionData, SessionFlashData>({
		// a Cookie from `createCookie` or the CookieOptions to create one
		cookie: {
			name: "__session",
			httpOnly: true,
			path: "/",
			sameSite: "lax",
			secrets: ["s3cret1"],
			// Set domain and secure only if in production
			...(isProduction
				? { domain: "your-production-domain.com", secure: true }
				: {}),
		},
	});

export { getSession, commitSession, destroySession };
