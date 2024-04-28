CREATE OR REPLACE FUNCTION ctfnote_private.start_working_on (user_id int, t_id int)
  RETURNS boolean
  AS $$
  DECLARE
  result boolean;
  r text;
  orig_user_id text;
  orig_user_role text;
  orig_role text;
BEGIN
  --- save original privileges
  SELECT current_setting('jwt.claims.user_id', true) as orig_user_id INTO orig_user_id;
  SELECT current_setting('jwt.claims.role', true) as orig_user_role INTO orig_user_role;
  SELECT current_setting('role', true) as orig_role INTO orig_role;

  --- drop into privileges of the user
  SELECT role FROM ctfnote_private.user WHERE id = user_id INTO r;
  PERFORM set_config('role', r, true);
  PERFORM set_config('jwt.claims.user_id', user_id::text, true);
  PERFORM set_config('jwt.claims.role', r, true);

  --- perform action
  IF NOT EXISTS (SELECT FROM ctfnote.work_on_task as wot WHERE profile_id = user_id AND wot.task_id = t_id AND active = TRUE) THEN
    PERFORM ctfnote.start_working_on(t_id);
    result := TRUE;
  ELSE
    result := FALSE;
  END IF;

  --- restore original privileges
  PERFORM set_config('role', orig_role, true);
  PERFORM set_config('jwt.claims.user_id', orig_user_id, true);
  PERFORM set_config('jwt.claims.role', orig_user_role, true);

    --- return
  RETURN result;
END;
$$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION ctfnote_private.stop_working_on (user_id int, t_id int)
  RETURNS boolean
  AS $$
  DECLARE
  result boolean;
  r text;
  orig_user_id text;
  orig_user_role text;
  orig_role text;
BEGIN
  --- save original privileges
  SELECT current_setting('jwt.claims.user_id', true) as orig_user_id INTO orig_user_id;
  SELECT current_setting('jwt.claims.role', true) as orig_user_role INTO orig_user_role;
  SELECT current_setting('role', true) as orig_role INTO orig_role;

  --- drop into privileges of the user
  SELECT role FROM ctfnote_private.user WHERE id = user_id INTO r;
  PERFORM set_config('role', r, true);
  PERFORM set_config('jwt.claims.user_id', user_id::text, true);
  PERFORM set_config('jwt.claims.role', r, true);

  --- perform action
  IF EXISTS (SELECT FROM ctfnote.work_on_task as wot WHERE profile_id = user_id AND wot.task_id = t_id AND active = TRUE) THEN
    PERFORM ctfnote.stop_working_on(t_id);
    result := TRUE;
  ELSE
    result := FALSE;
  END IF;
  
  --- restore original privileges
  PERFORM set_config('role', orig_role, true);
  PERFORM set_config('jwt.claims.user_id', orig_user_id, true);
  PERFORM set_config('jwt.claims.role', orig_user_role, true);

  --- return
  RETURN result;
END;
$$
LANGUAGE plpgsql;