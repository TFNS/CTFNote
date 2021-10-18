-- Import v1 CTF

CREATE FUNCTION migration.migrate_ctf("id" int)
	RETURNS ctfnote.ctf.id%TYPE AS $$
DECLARE
	ret ctfnote.ctf.id%TYPE;
BEGIN
	-- CTF
	INSERT INTO ctfnote.ctf(title, weight, ctf_url, logo_url, ctftime_url,
		description, start_time, end_time)
	SELECT
		migration."ctf"."title"                     as title,
		COALESCE(migration."ctf"."weight", 0)       as weight,
		migration."ctf"."ctfUrl"                    as ctf_url,
		migration."ctf"."logoUrl"                   as logo_url,
		migration."ctf"."ctfTimeUrl"                as ctftime_url,
		COALESCE(migration."ctf"."description", '') as description,
		COALESCE(migration."ctf"."start", NOW())    as start_time,
		COALESCE(migration."ctf"."finish", NOW())   as end_time
	FROM  migration."ctf"
	WHERE migration."ctf".id = migrate_ctf.id
	RETURNING ctfnote.ctf.id INTO ret;

	-- Secrets
	UPDATE ctfnote.ctf_secrets
	SET  credentials = COALESCE(migration.ctf.credentials, '')
	FROM migration.ctf
	WHERE ctf_secrets.id = ret AND migration.ctf.id = migrate_ctf.id;

	RETURN ret;
END;
$$ LANGUAGE plpgsql;

-- This table translates the ctfs' ID
CREATE TABLE migration.ref_ctf(
	old int REFERENCES migration."ctf"(id),
	new int REFERENCES ctfnote.ctf(id)
);

-- Migrate
INSERT INTO migration.ref_ctf(old, new)
SELECT id AS old, migration.migrate_ctf(id) AS new
FROM migration."ctf";

-- Remove the function
DROP FUNCTION migration.migrate_ctf;
