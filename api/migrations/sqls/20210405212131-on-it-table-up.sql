CREATE TABLE ctfnote.work_on_task (
    task_id int NOT NULL REFERENCES ctfnote.task (id) ON DELETE CASCADE,
    profile_id int NOT NULL REFERENCES ctfnote.profile (id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, profile_id)
);

CREATE INDEX ON "ctfnote"."work_on_task" ("task_id");

CREATE INDEX ON "ctfnote"."work_on_task" ("profile_id");

GRANT SELECT ON TABLE ctfnote.work_on_task TO user_guest;

CREATE FUNCTION ctfnote.start_working_on (task_id int)
    RETURNS ctfnote.work_on_task
    AS $$
    INSERT INTO ctfnote.work_on_task (task_id, profile_id)
        VALUES (start_working_on.task_id, ctfnote_private.current_id ())
    RETURNING
        *;

$$
LANGUAGE SQL
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote.start_working_on (int) TO user_guest;

CREATE FUNCTION ctfnote.stop_working_on (task_id int)
    RETURNS ctfnote.work_on_task
    AS $$
    DELETE FROM ctfnote.work_on_task
    WHERE work_on_task.task_id = stop_working_on.task_id
        AND profile_id = ctfnote_private.current_id ()
    RETURNING
        *;

$$
LANGUAGE SQL
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote.stop_working_on (int) TO user_guest;

