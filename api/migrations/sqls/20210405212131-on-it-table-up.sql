CREATE TABLE ctfnote.work_on_task (
    task_id int NOT NULL REFERENCES ctfnote.task (id),
    profile_id int NOT NULL REFERENCES ctfnote.profile (id),
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

CREATE FUNCTION ctfnote_private.delete_workonit_by_task ()
    RETURNS TRIGGER
    AS $$
BEGIN
    DELETE FROM ctfnote.work_on_task
    WHERE work_on_task.task_id = OLD.id;
    RETURN OLD;
END
$$
LANGUAGE plpgsql
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote_private.delete_workonit_by_task () TO user_guest;

CREATE FUNCTION ctfnote_private.delete_workonit_by_profile ()
    RETURNS TRIGGER
    AS $$
BEGIN
    DELETE FROM ctfnote.work_on_task
    WHERE work_on_task.profile_id = OLD.id;
    RETURN OLD;
END
$$
LANGUAGE plpgsql
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote_private.delete_workonit_by_profile () TO user_guest;

CREATE TRIGGER delete_workonit_on_task_delete
    BEFORE DELETE ON ctfnote.task
    FOR EACH ROW
    EXECUTE PROCEDURE ctfnote_private.delete_workonit_by_task ();

CREATE TRIGGER delete_workonit_on_profile_delete
    BEFORE DELETE ON ctfnote.profile
    FOR EACH ROW
    EXECUTE PROCEDURE ctfnote_private.delete_workonit_by_profile ();

