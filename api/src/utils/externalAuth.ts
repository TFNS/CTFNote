import Globals from "../config/globals";
import PersistentConfiguration from "../config/persitent";

import makeSlug from "../utils/slugify";
import User from "../entity/User";
import PasswordUtil from "../utils/password";

import { getConnection } from "typeorm";
import SessionManager from "../utils/session";

export default async function findOrCreateExternalUser(profile, done){
	const username = profile.username
	if (!username){
		return done("Contact your administrator for your external authentication.",null);
	}
	const slug = makeSlug(username);
	const userRepo = getConnection().getRepository(User);
	let user = await userRepo.findOne({ slug }, { select: ["password", "username", "slug", "rights", "externalAuth"] });
	
	if (!user){
		const userRepo = getConnection().getRepository(User);

		if (!(await PersistentConfiguration.get("allow-external-registration"))){
			return done("The external registration process is disabled, contact the administrator",null);
		}
		
		let user = userRepo.create({ username, slug, password: "empty_password", rights: Globals.defaultRights, externalAuth:true });

		try {
			user = await userRepo.save(user);
		} catch (e) {
			return done("A user with that username already exists",null);
		}
	}

	const session = await SessionManager.generateSession(slug);
	if (!session) return done("Failed", null);
	
	return done(null,{
		cookieName: Globals.cookieName,
		cookie: session.uuid,
		cookieOptions: {
			expires: session.expiresAt,
			httpOnly: true,
		}
	});
}