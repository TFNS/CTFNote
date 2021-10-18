CREATE TABLE ctfnote.task (
  "id" serial PRIMARY KEY,
  "title" text NOT NULL,
  CHECK ("title" <> ''),
  "description" text NOT NULL DEFAULT '',
  "category" text NOT NULL DEFAULT '???',
  "flag" text NOT NULL DEFAULT '',
  "pad_url" text NOT NULL,
  "ctf_id" integer NOT NULL REFERENCES ctfnote.ctf (id) ON DELETE CASCADE
);

COMMENT ON TABLE ctfnote.task IS E'@omit create';

CREATE INDEX ON ctfnote.task (ctf_id);

GRANT SELECT ON TABLE ctfnote.task TO user_guest;

GRANT UPDATE (title, description, category, flag) ON TABLE ctfnote.task TO user_guest;

GRANT DELETE ON TABLE ctfnote.task TO user_guest;

GRANT usage ON SEQUENCE ctfnote.task_id_seq
  TO user_guest;


/* Virtual column solved(boolean) */
CREATE FUNCTION ctfnote.task_solved (task ctfnote.task)
  RETURNS boolean
  AS $$
  SELECT
    NOT (task.flag IS NULL
      OR task.flag = '');

$$
LANGUAGE SQL
STABLE;

GRANT EXECUTE ON FUNCTION ctfnote.task_solved (ctfnote.task) TO user_guest;

