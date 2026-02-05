-- Allow null passwords for externally managed users
ALTER TABLE ctfnote_private.user
  ALTER COLUMN password DROP NOT NULL;

-- Login with external identity and register user if not present
CREATE FUNCTION ctfnote_private.login_with_extern("name" text, "role" ctfnote.role)
RETURNS ctfnote.jwt
AS $$
DECLARE
  log_user ctfnote_private.user;
BEGIN
  INSERT INTO ctfnote_private.user ("login", "password", "role")
    VALUES (login_with_extern.name, NULL, login_with_extern.role)
    ON CONFLICT ("login") DO UPDATE
      SET role = login_with_extern.role
  RETURNING
    * INTO log_user;
  INSERT INTO ctfnote.profile ("id", "username")
    VALUES (log_user.id, login_with_extern.name)
    ON CONFLICT (id) DO UPDATE
      SET username = login_with_extern.name;
  RETURN (ctfnote_private.new_token (log_user.id))::ctfnote.jwt;
END;
$$
LANGUAGE plpgsql
STRICT
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote_private.login_with_extern TO user_anonymous;
