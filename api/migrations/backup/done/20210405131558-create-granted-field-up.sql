CREATE FUNCTION ctfnote_private.is_admin ()
  RETURNS boolean
  AS $$
  SELECT
    current_setting('jwt.claims.role', TRUE)::ctfnote.role = 'user_admin'::ctfnote.role;

$$
LANGUAGE sql
STABLE;

CREATE FUNCTION ctfnote_private.is_manager ()
  RETURNS boolean
  AS $$
  SELECT
    ctfnote_private.is_admin ()
    OR current_setting('jwt.claims.role', TRUE)::ctfnote.role = 'user_manager'::ctfnote.role;

;

$$
LANGUAGE sql
STABLE;

CREATE FUNCTION ctfnote_private.is_member ()
  RETURNS boolean
  AS $$
  SELECT
    ctfnote_private.is_manager ()
    OR current_setting('jwt.claims.role', TRUE)::ctfnote.role = 'user_member'::ctfnote.role;

;

$$
LANGUAGE sql
STABLE;

CREATE FUNCTION ctfnote_private.is_guest ()
  RETURNS boolean
  AS $$
  SELECT
    ctfnote_private.is_member ()
    OR current_setting('jwt.claims.role', TRUE)::ctfnote.role = 'user_guest'::ctfnote.role;

;

$$
LANGUAGE sql
STABLE;

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
        AND invitation.user_id = ctfnote_private.current_user_id ())
$$
LANGUAGE sql
STABLE;

GRANT EXECUTE ON FUNCTION ctfnote_private.can_play_ctf TO user_guest;

GRANT EXECUTE ON FUNCTION ctfnote_private.is_admin () TO user_anonymous;

GRANT EXECUTE ON FUNCTION ctfnote_private.is_manager () TO user_anonymous;

GRANT EXECUTE ON FUNCTION ctfnote_private.is_member () TO user_anonymous;

GRANT EXECUTE ON FUNCTION ctfnote_private.is_guest () TO user_anonymous;

CREATE FUNCTION ctfnote.ctf_granted (ctf ctfnote.ctf)
  RETURNS boolean
  AS $$
  SELECT
    ctfnote_private.can_play_ctf (ctf.id)
$$
LANGUAGE sql
STABLE;


/* CREATE POLICY check_invitation_for_task ON ctfnote.task
 FOR UPDATE
 USING (EXIST (
 SELECT
 user_id
 FROM
 ctfnote.invitation
 WHERE
 user_id = ctfnote_private.current_user_id ())
 WITH CHECK ("userId" = current_user_id ()); */
GRANT EXECUTE ON FUNCTION ctfnote.ctf_granted TO user_guest;

