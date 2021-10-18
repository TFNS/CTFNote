/**/
CREATE FUNCTION ctfnote.start_working_on (task_id int)
  RETURNS ctfnote.work_on_task
  AS $$
  INSERT INTO ctfnote.work_on_task (task_id, profile_id)
    VALUES (start_working_on.task_id, ctfnote_private.user_id ())
  RETURNING
    *;

$$
LANGUAGE SQL
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote.start_working_on (int) TO user_guest;


/**/
CREATE FUNCTION ctfnote.stop_working_on (task_id int)
  RETURNS ctfnote.work_on_task
  AS $$
  DELETE FROM ctfnote.work_on_task
  WHERE work_on_task.task_id = stop_working_on.task_id
    AND profile_id = ctfnote_private.user_id ()
  RETURNING
    *;

$$
LANGUAGE SQL
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote.stop_working_on (int) TO user_guest;

