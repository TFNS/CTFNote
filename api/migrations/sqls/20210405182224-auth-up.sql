CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE FUNCTION ctfnote_private.do_register ("login" text, "password" text, "role" ctfnote.role)
  RETURNS ctfnote.jwt
  AS $$
DECLARE
  new_user ctfnote_private.user;
  new_profile ctfnote.profile;
BEGIN
  INSERT INTO ctfnote_private.user ("login", "password", "role")
    VALUES (do_register.login, crypt(do_register.password, gen_salt('bf')), do_register.role)
  RETURNING
    * INTO new_user;
  INSERT INTO ctfnote.profile ("id", "username")
    VALUES (new_user.id, login)
  RETURNING
    * INTO new_profile;
  RETURN ctfnote_private.new_token (new_user.id);
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Username already taken';
END;

$$
LANGUAGE plpgsql
STRICT
SECURITY DEFINER;

CREATE FUNCTION ctfnote.register (LOGIN text, PASSWORD text)
  RETURNS ctfnote.jwt
  AS $$
DECLARE
  is_first_user boolean;
BEGIN
  IF NOT current_setting('settings.allow_registration')::boolean THEN
    RAISE EXCEPTION 'Registration are disabled';
  END IF;
  SELECT
    (count(id) = 0) INTO is_first_user
  FROM
    ctfnote_private.user;
  RETURN ctfnote_private.do_register (login, crypt("password", gen_salt('bf')), (
      CASE WHEN (is_first_user) THEN
        'user_admin'::ctfnote.role
      ELSE
        'user_guest'::ctfnote.role
      END));
END;
$$
LANGUAGE plpgsql
STRICT
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote.register (text, text) TO user_anonymous;

CREATE FUNCTION ctfnote.login ("login" text, "password" text)
  RETURNS ctfnote.jwt
  AS $$
DECLARE
  log_user ctfnote_private.user;
BEGIN
  SELECT
    * INTO log_user
  FROM
    ctfnote_private.user
  WHERE
    "user"."login" = "login"."login";
  IF log_user."password" = crypt("password", log_user."password") THEN
    RETURN ctfnote_private.new_token (log_user.id);
  ELSE
    RAISE EXCEPTION 'Invalid username or password';
  END IF;
END;
$$
LANGUAGE plpgsql
STRICT
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote.login (text, text) TO user_anonymous;

CREATE FUNCTION ctfnote_private.user_id ()
  RETURNS integer
  AS $$
  SELECT
    nullif (current_setting('jwt.claims.user_id', TRUE), '')::integer;

$$
LANGUAGE sql
STABLE;

GRANT EXECUTE ON FUNCTION ctfnote_private.user_id () TO user_guest;

CREATE TYPE ctfnote.me_response AS (
  "profile" ctfnote.profile,
  "jwt" ctfnote.jwt
);

CREATE FUNCTION ctfnote.me ()
  RETURNS ctfnote.me_response
  AS $$
DECLARE
  me ctfnote.profile;
BEGIN
  SELECT
    * INTO me
  FROM
    ctfnote.profile
  WHERE
    id = ctfnote_private.user_id ()
  LIMIT 1;
  IF me IS NOT NULL THEN
    RETURN (me,
      ctfnote_private.new_token (me.id))::ctfnote.me_response;
  ELSE
    RETURN NULL;
  END IF;
END;
$$
LANGUAGE plpgsql
STRICT STABLE;

GRANT EXECUTE ON FUNCTION ctfnote.me () TO user_anonymous;

