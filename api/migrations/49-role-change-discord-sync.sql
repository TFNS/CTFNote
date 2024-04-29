CREATE OR REPLACE FUNCTION ctfnote_private.user_can_play_ctfs (user_id int)
  RETURNS SETOF ctfnote.ctf
  AS $$
  DECLARE
  r text;
  p ctfnote.profile;
  orig_user_id text;
  orig_user_role text;
  orig_role text;
BEGIN
  --- save original privileges
  SELECT current_setting('jwt.claims.user_id', true) as orig_user_id INTO orig_user_id;
  SELECT current_setting('jwt.claims.role', true) as orig_user_role INTO orig_user_role;
  SELECT current_setting('role', true) as orig_role INTO orig_role;

  --- drop into privileges of the user
  SELECT * FROM ctfnote.profile WHERE id = user_id INTO p;
  SELECT * FROM ctfnote.profile_role(p) INTO r;
  PERFORM set_config('role', r::text, true);
  PERFORM set_config('jwt.claims.user_id', user_id::text, true);
  PERFORM set_config('jwt.claims.role', r::text, true);

  --- perform action
  RETURN QUERY SELECT
    *
  FROM
    ctfnote.ctf as ctf
  WHERE
    ctfnote_private.can_play_ctf(ctf.id);

  --- restore original privileges
  PERFORM set_config('role', orig_role, true);
  PERFORM set_config('jwt.claims.user_id', orig_user_id, true);
  PERFORM set_config('jwt.claims.role', orig_user_role, true);

  --- return
  RETURN;
END;
$$
LANGUAGE plpgsql;

--- Allow admin to impersonate any user in order to make the privilege modification with Discord sync work
GRANT EXECUTE ON FUNCTION ctfnote_private.user_can_play_ctfs(int) TO user_admin;
