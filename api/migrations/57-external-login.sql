-- Login with external identity and register/migrate user if not present/externally managed
CREATE FUNCTION ctfnote_private.login_with_extern("name" text, "role" ctfnote.role)
RETURNS ctfnote.jwt
AS $$
DECLARE
  log_user ctfnote_private.user;
BEGIN
  INSERT INTO ctfnote_private.user ("login", "password", "role")
    VALUES (login_with_extern.name, 'external', login_with_extern.role)
    ON CONFLICT ("login") DO UPDATE
      SET login = login_with_extern.name, password = 'external', role = login_with_extern.role
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
