// Published under GNU General Public License v3.0 by JJ-8
// https://github.com/JJ-8/CTFNote/blob/427fa61da7680583043d15914cced72dab574e08/api/src/plugins/hedgedocAuth.ts
// The full License text can be found here https://github.com/JJ-8/CTFNote/blob/main/LICENSE

import { makeWrapResolversPlugin, gql } from "graphile-utils";
import axios from "axios";
import savepointWrapper from "./savepointWrapper";
import querystring from "querystring";

export class HedgedocAuth {
	private static async baseUrl(): Promise<string | null> {
        /*
		let cleanUrl: string =
			process.env.CREATE_PAD_URL || "http://hedgedoc:3000/new";
		cleanUrl = cleanUrl.slice(0, -4); //remove '/new' for clean url
		return cleanUrl;
        */
        return "http://hedgedoc:3000"
	}

	private static async authPad(
		username: string,
		password: string,
		url: URL
	): Promise<string> {
		let domain: string;
		//if domain does not end in '.[tld]', it will be rejected
		//so we add '.local' manually
		if (url.hostname.split(".").length == 1) {
			domain = `${url.hostname}.local`;
		} else {
			domain = url.hostname;
		}

		const email = `${username}@${domain}`;

		try {
			const res = await axios.post(
				url.toString(),
				querystring.stringify({
					email: email,
					password: password,
				}),
				{
					validateStatus: (status) => status === 302,
					maxRedirects: 0,
					timeout: 5000,
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				}
			);
			return res.headers["set-cookie"][0];
		} catch (e) {
			console.error(e);
			return "";
		}
	}

	static async register(username: string, password: string): Promise<string> {
		const authUrl = new URL(`${await this.baseUrl()}/register`);
		return this.authPad(username, password, authUrl);
	}

	static async verifyLogin(cookie: string) {
		const url = new URL(`${await this.baseUrl()}/me`);

		try {
			const res = await axios.get(url.toString(), {
				validateStatus: (status) => status === 200,
				maxRedirects: 0,
				timeout: 5000,
				headers: {
					Cookie: cookie,
				},
			});

			return res.data.status == "ok";
		} catch (e) {
			return false;
		}
	}

	static async login(username: string, password: string): Promise<string> {
		const authUrl = new URL(`${await this.baseUrl()}/login`);
		const result = await this.authPad(username, password, authUrl);
		const success = await this.verifyLogin(result);
		if (!success) {
			//create account for existing users that are not registered to Hedgedoc
			await this.register(username, password);
			return this.authPad(username, password, authUrl);
		} else {
			return result;
		}
	}
}

export default makeWrapResolversPlugin({
	Mutation: {
		changePassword: {
			async resolve(
				resolve: any,
				_source,
				args,
				context: any,
				_resolveInfo
			) {
				throw Error("Disabled until further notice.");
			},
		},
		login: {
			async resolve(
				resolve: any,
				_source,
				args,
				context: any,
				_resolveInfo
			) {
				const result = await resolve();
				context.setHeader(
					"set-cookie",
					await HedgedocAuth.login(
						args.input.login,
						args.input.password
					)
				);
				return result;
			},
		},
		register: {
			async resolve(
				resolve: any,
				_source,
				args,
				context: any,
				_resolveInfo
			) {
				const result = await resolve();
				await HedgedocAuth.register(
					args.input.login,
					args.input.password
				);
				context.setHeader(
					"set-cookie",
					await HedgedocAuth.login(
						args.input.login,
						args.input.password
					)
				);
				return result;
			},
		},
	},
});
