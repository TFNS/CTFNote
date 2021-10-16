-- Import v1 users

CREATE FUNCTION migration.migrate_user("id" int)
	RETURNS ctfnote_private.user.id%TYPE AS $$
DECLARE
	ret ctfnote_private.user.id%TYPE;
BEGIN
	-- User
	INSERT INTO ctfnote_private.user(login, password, role)
	SELECT
		-- username is case insensitive, maybe use slug?
		username AS login,

		-- Replace $2b$ with $2a$ in hash (works for < 255 chars)
		REPLACE(migration."user".password, '$2b$', '$2a$') AS password,

		-- Map rights -> role
		(CASE WHEN 'ADMIN_ALL' = ANY(migration."user".rights) THEN
			'user_admin'::ctfnote.role
		WHEN 'EDIT_CTF' = ANY(migration."user".rights) THEN
			'user_manager'::ctfnote.role
		WHEN 'CTF_ALL' = ANY(migration."user".rights) THEN
			'user_member'::ctfnote.role
		ELSE
			'user_guest'::ctfnote.role
		END) AS role
	FROM  migration."user"
	WHERE migration."user".id = migrate_user.id
	RETURNING ctfnote_private.user.id INTO ret;

	-- Settings
	INSERT INTO ctfnote.profile(id, username)
	VALUES(ret, (SELECT login FROM ctfnote_private.user
		WHERE ctfnote_private.user.id = ret));

	RETURN ret;
END;
$$ LANGUAGE plpgsql;

-- This table translates the users' ID
CREATE TABLE migration.ref_users(
	old int REFERENCES migration."user"(id),
	new int REFERENCES ctfnote_private.user(id)
);

-- Migrate
INSERT INTO migration.ref_users(old, new)
SELECT id AS old, migration.migrate_user(id) AS new
FROM migration."user";

-- Remove the function
DROP FUNCTION migration.migrate_user;
