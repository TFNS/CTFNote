--Check if current user is allowed to access past ctfs
CREATE FUNCTION ctfnote_private.is_past_ctfs ()
  RETURNS boolean
  AS $$
  SELECT
    ctfnote_private.current_role () = 'user_past_ctfs'::ctfnote.role
    OR ctfnote_private.is_member ();

$$
LANGUAGE sql
STABLE;

GRANT EXECUTE ON FUNCTION ctfnote_private.is_past_ctfs () TO user_anonymous;

CREATE OR REPLACE FUNCTION ctfnote_private.can_play_ctf (ctf_id int)
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
        AND invitation.profile_id = ctfnote_private.user_id ())
    OR (
        ctfnote_private.is_past_ctfs () 
        AND 
        (SELECT TRUE FROM ctfnote.ctf WHERE end_time < NOW() AND ctf.id = can_play_ctf.ctf_id)
    )
$$
LANGUAGE sql
STABLE;

GRANT EXECUTE ON FUNCTION ctfnote_private.can_play_ctf TO user_guest;
