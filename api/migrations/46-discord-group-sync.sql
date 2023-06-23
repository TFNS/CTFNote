CREATE OR REPLACE FUNCTION ctfnote_private.user_can_play_ctfs (user_id int)
  RETURNS SETOF ctfnote.ctf
  AS $$
  DECLARE
  r text;
  BEGIN
  SELECT role FROM ctfnote_private.user WHERE id = user_id INTO r;
  -- drop into privileges of the user
  PERFORM set_config('role', r, true);
  PERFORM set_config('jwt.claims.user_id', user_id::text, true);
  PERFORM set_config('jwt.claims.role', r, true);
  RETURN QUERY SELECT
    *
  FROM
    ctfnote.ctf as ctf
  WHERE
    ctfnote_private.can_play_ctf(ctf.id);
  END;
$$
LANGUAGE plpgsql;
