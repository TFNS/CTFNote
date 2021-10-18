CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE ctfnote.me_response AS (
  "profile" ctfnote.profile,
  "jwt" ctfnote.jwt
);


/* DO register */
CREATE FUNCTION ctfnote_private.do_register ("login" text, "password" text, "role" ctfnote.role)
  RETURNS ctfnote.jwt
  AS $$
DECLARE
  new_user ctfnote_private.user;
BEGIN
  INSERT INTO ctfnote_private.user ("login", "password", "role")
    VALUES (do_register.login, crypt(do_register.password, gen_salt('bf')), do_register.role)
  RETURNING
    * INTO new_user;
  INSERT INTO ctfnote.profile ("id", "username")
    VALUES (new_user.id, login);
  RETURN (ctfnote_private.new_token (new_user.id))::ctfnote.jwt;
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Username already taken';
END;

$$
LANGUAGE plpgsql
STRICT
SECURITY DEFINER;


/* Register */
CREATE FUNCTION ctfnote.register (LOGIN text, PASSWORD text)
  RETURNS ctfnote.jwt
  AS $$
DECLARE
  is_first_user boolean;
  settings ctfnote.settings;
BEGIN
  SELECT
    * INTO settings
  FROM
    ctfnote.settings
  LIMIT 1;
  IF NOT settings.registration_allowed THEN
    RAISE EXCEPTION 'Registration are disabled';
  END IF;
  SELECT
    (count(id) = 0) INTO is_first_user
  FROM
    ctfnote_private.user;
  RETURN ctfnote_private.do_register (login, "register"."password", (
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


/* Register with password */
CREATE FUNCTION ctfnote.register_with_password (LOGIN text, PASSWORD text, ctfnote_password text)
  RETURNS ctfnote.jwt
  AS $$
DECLARE
  settings ctfnote.settings;
BEGIN
  SELECT
    * INTO settings
  FROM
    ctfnote.settings
  LIMIT 1;
  IF NOT settings.registration_password_allowed THEN
    RAISE EXCEPTION 'Registration with password are disabled';
  END IF;
  IF ctfnote_password != settings.registration_password OR settings.registration_password = '' THEN
    RAISE EXCEPTION 'Invalid registration password';
  END IF;
  RETURN ctfnote_private.do_register ("register_with_password"."login", "register_with_password"."password", settings.registration_default_role);
END;
$$
LANGUAGE plpgsql
STRICT
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote.register_with_password (text, text, text) TO user_anonymous;


/* Login */
CREATE FUNCTION ctfnote.login ("login" text, "password" text)
  RETURNS ctfnote.jwt
  AS $$
DECLARE
  log_user ctfnote_private.user;
  log_profile ctfnote.profile;
BEGIN
  SELECT
    * INTO log_user
  FROM
    ctfnote_private.user
  WHERE
    "user"."login" = "login"."login";
  IF log_user."password" = crypt("login"."password", log_user."password") THEN
    RETURN (ctfnote_private.new_token (log_user.id))::ctfnote.jwt;
  ELSE
    RAISE EXCEPTION 'Invalid username or password';
  END IF;
END;
$$
LANGUAGE plpgsql
STRICT
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote.login (text, text) TO user_anonymous;


/* ME */
CREATE OR REPLACE FUNCTION ctfnote.me ()
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
  IF me.id IS NOT NULL THEN
    RETURN (me,
      ctfnote_private.new_token (me.id))::ctfnote.me_response;
  ELSE
    RETURN (null, null)::ctfnote.me_response;
  END IF;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER
STRICT STABLE;

GRANT EXECUTE ON FUNCTION ctfnote.me () TO user_anonymous;

