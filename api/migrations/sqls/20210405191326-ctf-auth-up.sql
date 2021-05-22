CREATE FUNCTION ctfnote_private.can_play_ctf (ctf_id int)
  RETURNS boolean
  AS $$
  SELECT
    ctfnote_private.is_member ()
    OR (
      SELECT
        TRUE
      FROM
        ctfnote.invitation
      WHERE
        invitation.ctf_id = can_play_ctf.ctf_id
        AND invitation.profile_id = ctfnote_private.current_id ())
$$
LANGUAGE sql
STABLE;

GRANT EXECUTE ON FUNCTION ctfnote_private.can_play_ctf TO user_guest;


CREATE FUNCTION ctfnote.ctf_granted (ctf ctfnote.ctf)
  RETURNS boolean
  AS $$
  SELECT
    ctfnote_private.can_play_ctf (ctf.id)
$$
LANGUAGE sql
STABLE;

GRANT EXECUTE ON FUNCTION ctfnote.ctf_granted TO user_guest;

