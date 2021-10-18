/* create_task(title, description, category, flag, padUrl, ctf_id) -> Task */
CREATE FUNCTION ctfnote_private.create_task (title text, description text, category text, flag text, pad_url text, ctf_id int)
  RETURNS ctfnote.task
  AS $$
  INSERT INTO ctfnote.task (title, description, category, flag, pad_url, ctf_id)
    VALUES (title, description, category, flag, pad_url, ctf_id)
  RETURNING
    *;

$$
LANGUAGE SQL
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote_private.create_task (text, text, text, text, text, int) TO user_guest;


/* can_play_task(ctf_id) -> BOOL */
CREATE FUNCTION ctfnote_private.can_play_task (task_id int)
  RETURNS boolean
  AS $$
  SELECT
    ctfnote_private.is_member ()
    OR (
      SELECT
        ctfnote_private.can_play_ctf (ctf.id)
      FROM
        ctfnote.ctf,
        ctfnote.task
      WHERE
        task.id = can_play_task.task_id
        AND task.ctf_id = ctf.id)
$$
LANGUAGE sql
STABLE;

GRANT EXECUTE ON FUNCTION ctfnote_private.can_play_task TO user_guest;

