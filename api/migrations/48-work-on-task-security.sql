CREATE POLICY update_work_on_task ON ctfnote.work_on_task
  FOR UPDATE TO user_guest
    USING (ctfnote_private.can_play_task (task_id));

CREATE POLICY member_update_work_on_task ON ctfnote.work_on_task
  FOR UPDATE TO user_member
    USING (TRUE);

CREATE POLICY delete_work_on_task ON ctfnote.work_on_task
  FOR DELETE TO user_guest
    USING (ctfnote_private.can_play_task (task_id));

CREATE POLICY member_delete_work_on_task ON ctfnote.work_on_task
  FOR DELETE TO user_member
    USING (TRUE);

CREATE POLICY insert_work_on_task ON ctfnote.work_on_task
  FOR INSERT TO user_guest
    WITH CHECK (ctfnote_private.can_play_task (task_id));

CREATE POLICY member_insert_work_on_task ON ctfnote.work_on_task
  FOR INSERT TO user_member
    WITH CHECK (TRUE);

GRANT INSERT ON TABLE ctfnote.work_on_task TO user_guest;
GRANT DELETE ON TABLE ctfnote.work_on_task TO user_guest;

CREATE OR REPLACE FUNCTION ctfnote.start_working_on (task_id int)
  RETURNS ctfnote.work_on_task
  AS $$
  INSERT INTO ctfnote.work_on_task (task_id, profile_id)
    VALUES (start_working_on.task_id, ctfnote_private.user_id ())
  RETURNING
    *;

$$
LANGUAGE SQL;

CREATE OR REPLACE FUNCTION ctfnote.stop_working_on (task_id int)
  RETURNS ctfnote.work_on_task
  AS $$
  DELETE FROM ctfnote.work_on_task
  WHERE work_on_task.task_id = stop_working_on.task_id
    AND profile_id = ctfnote_private.user_id ()
  RETURNING
    *;

$$
LANGUAGE SQL;