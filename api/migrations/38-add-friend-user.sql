--Check if current user is allowed to access past ctfs
CREATE FUNCTION ctfnote_private.is_friend ()
  RETURNS boolean
  AS $$
  SELECT
    ctfnote_private.current_role () = 'user_friend'::ctfnote.role
    OR ctfnote_private.is_member ();

$$
LANGUAGE sql
STABLE;

GRANT EXECUTE ON FUNCTION ctfnote_private.is_friend () TO user_anonymous;

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
        ctfnote_private.is_friend () 
        AND 
        (SELECT TRUE FROM ctfnote.ctf WHERE end_time < NOW() AND ctf.id = can_play_ctf.ctf_id)
    )
$$
LANGUAGE sql
STABLE;

--Check if current user is guest
CREATE OR REPLACE FUNCTION ctfnote_private.is_guest ()
  RETURNS boolean
  AS $$
  SELECT
    ctfnote_private.current_role () = 'user_guest'::ctfnote.role
    OR ctfnote_private.is_friend ();

$$
LANGUAGE sql
STABLE;

GRANT EXECUTE ON FUNCTION ctfnote_private.can_play_ctf TO user_guest;
