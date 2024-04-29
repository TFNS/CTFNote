CREATE OR REPLACE FUNCTION ctfnote.cancel_working_on (task_id int)
  RETURNS ctfnote.work_on_task
  AS $$
  DELETE FROM ctfnote.work_on_task
  WHERE work_on_task.task_id = cancel_working_on.task_id
    AND profile_id = ctfnote_private.user_id ()
  RETURNING
    *;
$$
LANGUAGE SQL;

GRANT EXECUTE ON FUNCTION ctfnote.cancel_working_on (int) TO user_guest;
GRANT DELETE ON TABLE ctfnote.work_on_task TO user_guest;
