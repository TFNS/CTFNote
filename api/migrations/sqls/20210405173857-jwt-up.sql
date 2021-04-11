CREATE TYPE ctfnote.jwt AS (
  "user_id" int,
  "role" ctfnote.role,
  "exp" bigint
);

-- GET profile.role from JWT
CREATE FUNCTION ctfnote_private.current_role ()
  RETURNS ctfnote.role
  AS $$
  SELECT
    nullif (current_setting('jwt.claims.role', TRUE), '')::ctfnote.role;

$$
LANGUAGE sql
STABLE;

GRANT EXECUTE ON FUNCTION ctfnote_private.current_role () TO user_anonymous;

-- GET profile.id from jwt
CREATE FUNCTION ctfnote_private.current_id ()
  RETURNS int
  AS $$
  SELECT
    nullif (current_setting('jwt.claims.user_id', TRUE), '')::int;

$$
LANGUAGE sql
STABLE;

GRANT EXECUTE ON FUNCTION ctfnote_private.current_id () TO user_anonymous;

-- Check if current user is admin
CREATE FUNCTION ctfnote_private.is_admin ()
  RETURNS boolean
  AS $$
  SELECT
    ctfnote_private.current_role () = 'user_admin'::ctfnote.role;

$$
LANGUAGE sql
STABLE;

GRANT EXECUTE ON FUNCTION ctfnote_private.is_admin () TO user_anonymous;

--Check if current user is manager
CREATE FUNCTION ctfnote_private.is_manager ()
  RETURNS boolean
  AS $$
  SELECT
    ctfnote_private.current_role () = 'user_manager'::ctfnote.role
    OR ctfnote_private.is_admin ();

;

$$
LANGUAGE sql
STABLE;

GRANT EXECUTE ON FUNCTION ctfnote_private.is_manager () TO user_anonymous;

--Check if current user is member
CREATE FUNCTION ctfnote_private.is_member ()
  RETURNS boolean
  AS $$
  SELECT
    ctfnote_private.current_role () = 'user_member'::ctfnote.role
    OR ctfnote_private.is_manager ();

$$
LANGUAGE sql
STABLE;

GRANT EXECUTE ON FUNCTION ctfnote_private.is_member () TO user_anonymous;

--Check if current user is guest
CREATE FUNCTION ctfnote_private.is_guest ()
  RETURNS boolean
  AS $$
  SELECT
    ctfnote_private.current_role () = 'user_guest'::ctfnote.role
    OR ctfnote_private.is_member ();

$$
LANGUAGE sql
STABLE;

GRANT EXECUTE ON FUNCTION ctfnote_private.is_guest () TO user_anonymous;

--Generate JWT
CREATE FUNCTION ctfnote_private.new_token ("user_id" int, "role" ctfnote.role)
  RETURNS ctfnote.jwt
  AS $$
  SELECT
    ("user_id",
      "role",
      extract(epoch FROM (now() + interval '30 days')))::ctfnote.jwt
$$
LANGUAGE SQL;

GRANT EXECUTE ON FUNCTION ctfnote_private.new_token (int, ctfnote.role) TO user_anonymous;

