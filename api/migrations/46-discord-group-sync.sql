CREATE OR REPLACE FUNCTION ctfnote_private.user_can_play_ctfs (user_id int)
  RETURNS SETOF ctfnote.ctf
  AS $$
  DECLARE
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

CREATE OR REPLACE FUNCTION ctfnote_private.user_can_play_ctf (user_id int, ctf_id int)
  RETURNS BOOLEAN
  AS $$
  DECLARE
  r text;
  result BOOLEAN;
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
  SELECT
    ctfnote_private.can_play_ctf(ctf_id) INTO result;
  
  --- restore original privileges
  PERFORM set_config('role', orig_role, true);
  PERFORM set_config('jwt.claims.user_id', orig_user_id, true);
  PERFORM set_config('jwt.claims.role', orig_user_role, true);

  --- return result
  RETURN result;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION ctfnote_private.users_can_play_ctf (ctf_id int)
  RETURNS SETOF ctfnote.profile
  AS $$
  SELECT
    *
  FROM ctfnote.profile as profile
  WHERE
    ctfnote_private.user_can_play_ctf(profile.id, ctf_id);
$$
LANGUAGE sql;

CREATE OR REPLACE FUNCTION ctfnote_private.discord_users_can_play_ctf (ctf_id int)
  RETURNS SETOF ctfnote.profile
  AS $$
  SELECT
    *
  FROM ctfnote_private.users_can_play_ctf(ctf_id) as profile
  WHERE
    profile.discord_id IS NOT NULL;
$$
LANGUAGE sql;