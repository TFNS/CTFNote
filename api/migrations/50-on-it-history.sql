ALTER TABLE ctfnote.work_on_task
  ADD COLUMN active boolean NOT NULL DEFAULT TRUE;

CREATE OR REPLACE FUNCTION ctfnote.start_working_on (task_id int)
  RETURNS ctfnote.work_on_task
  AS $$
  WITH inserted AS (
    INSERT INTO ctfnote.work_on_task (task_id, profile_id, active)
      VALUES (start_working_on.task_id, ctfnote_private.user_id (), TRUE)
      ON CONFLICT (task_id, profile_id) DO UPDATE
        SET active = TRUE
      RETURNING
        *
  )
  SELECT * FROM inserted;

$$
LANGUAGE SQL;


-- Add a trigger to set the active column to false when a user stops working on a task
CREATE OR REPLACE FUNCTION ctfnote.stop_working_on (task_id int)
  RETURNS ctfnote.work_on_task
  AS $$
  UPDATE ctfnote.work_on_task
    SET active = FALSE
  WHERE work_on_task.task_id = stop_working_on.task_id
    AND profile_id = ctfnote_private.user_id ()
  RETURNING
    *;

$$
LANGUAGE SQL;


GRANT UPDATE ON TABLE ctfnote.work_on_task TO user_guest;
REVOKE DELETE ON TABLE ctfnote.work_on_task FROM user_guest;

-- WORK ON
CREATE OR REPLACE FUNCTION ctfnote_private.notify_work_on_task ()
  RETURNS TRIGGER
  AS $$
DECLARE
  current_ctf_id int;
BEGIN
  CASE TG_OP
  WHEN 'INSERT' THEN
    PERFORM
      ctfnote_private.notify ('update', 'tasks', NEW.task_id); RETURN NEW;
  WHEN 'UPDATE' THEN
    PERFORM
      ctfnote_private.notify ('update', 'tasks', NEW.task_id); RETURN NEW;
  WHEN 'DELETE' THEN
    PERFORM
      ctfnote_private.notify ('update', 'tasks', OLD.task_id); RETURN OLD;
  END CASE;
  END
$$ VOLATILE
LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS _500_gql_update_work_on_task ON ctfnote.work_on_task;

CREATE TRIGGER _500_gql_update_work_on_task
  AFTER INSERT OR UPDATE OR DELETE ON ctfnote.work_on_task
  FOR EACH ROW
  EXECUTE PROCEDURE ctfnote_private.notify_work_on_task ();