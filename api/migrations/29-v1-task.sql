-- Import v1 CTF

CREATE FUNCTION migration.migrate_task("id" int)
	RETURNS ctfnote.task.id%TYPE AS $$
DECLARE
	ret ctfnote.ctf.id%TYPE;
BEGIN
	INSERT INTO ctfnote.task(title, description, category, flag, pad_url,
		ctf_id)
	SELECT
		migration.task.title                     as title,
		COALESCE(migration.task.description, '') as description,
		COALESCE(migration.task.category, '?')   as category,

		(CASE WHEN migration.task.solved THEN
			'missing flag'
		ELSE
			''
		END) as flag,

		migration.task."padUrl" as pad_url,

		(SELECT new
		FROM  migration.ref_ctf
		WHERE old = migration.task."ctfId") as ctf_id

	FROM  migration."task"
	WHERE migration."task"."ctfId" IS NOT NULL -- dangling tasks (deleted)
	AND   migration."task".id = migrate_task.id
	RETURNING ctfnote.task.id INTO ret;

	RETURN ret;
END;
$$ LANGUAGE plpgsql;

-- This table translates the tasks' ID
CREATE TABLE migration.ref_tasks(
	old int REFERENCES migration."task"(id),
	new int REFERENCES ctfnote.task(id)
);

-- Migrate
INSERT INTO migration.ref_tasks(old, new)
SELECT id AS old, migration.migrate_task(id) AS new
FROM migration."task";

-- Remove the function
DROP FUNCTION migration.migrate_task;
