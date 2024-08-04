ALTER TABLE ctfnote_private.invitation_link
  ADD COLUMN "discord_id" TEXT UNIQUE DEFAULT NULL;

DROP FUNCTION ctfnote.create_invitation_link ("role" ctfnote.role);
CREATE OR REPLACE FUNCTION ctfnote.create_invitation_link ("role" ctfnote.role, "discord_id" text default null)
  RETURNS ctfnote.invitation_link_response
  AS $$
DECLARE
  invitation_link ctfnote_private.invitation_link;
BEGIN
  INSERT INTO ctfnote_private.invitation_link ("role", "token", "discord_id")
    VALUES (create_invitation_link.role, gen_random_uuid (), create_invitation_link.discord_id)
  RETURNING
    * INTO invitation_link;
  RETURN ROW (invitation_link.token::text)::ctfnote.invitation_link_response;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote.create_invitation_link (ctfnote.role, text) TO user_admin;

CREATE OR REPLACE FUNCTION ctfnote.register_with_token ("token" text, "login" text, "password" text)
  RETURNS ctfnote.jwt
  AS $$
DECLARE
  invitation_role ctfnote.role;
  invitation_discord_id text;
BEGIN
  SELECT
    ROLE, discord_id INTO invitation_role, invitation_discord_id
  FROM
    ctfnote_private.invitation_link
  WHERE
    invitation_link.token::text = register_with_token.token
    AND expiration > now();
  IF invitation_role IS NOT NULL THEN
    DELETE FROM ctfnote_private.invitation_link
    WHERE invitation_link.token::text = register_with_token.token;
    IF invitation_discord_id IS NOT NULL THEN
      RETURN ctfnote_private.do_register (register_with_token.login, register_with_token.password, invitation_role, invitation_discord_id);
    ELSE
      RETURN ctfnote_private.do_register (register_with_token.login, register_with_token.password, invitation_role);
    END IF;
  ELSE
    RAISE EXCEPTION 'Invalid token';
  END IF;
END
$$
LANGUAGE plpgsql
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote.register_with_token (text, text, text) TO user_anonymous;

-- first we remove and re-apply the old internal registration function to be extra verbose
-- we implement the additional logic for registration with discord_id in a seperate function with the same name, thus overloading this function for normal original operation and
-- operation with the new discord id linking.
DROP FUNCTION ctfnote_private.do_register ("login" text, "password" text, "role" ctfnote.role);

CREATE OR REPLACE FUNCTION ctfnote_private.do_register ("login" text, "password" text, "role" ctfnote.role)
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
    VALUES (new_user.id, do_register.login);
  RETURN (ctfnote_private.new_token (new_user.id))::ctfnote.jwt;
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Username already taken';
END;
$$
LANGUAGE plpgsql
STRICT
SECURITY DEFINER;

-- overloaded function, implements the logic needed for discord linking.
CREATE OR REPLACE FUNCTION ctfnote_private.do_register ("login" text, "password" text, "role" ctfnote.role, "discord_id" text)
  RETURNS ctfnote.jwt
  AS $$
DECLARE
  new_user ctfnote_private.user;
BEGIN
  INSERT INTO ctfnote_private.user ("login", "password", "role")
    VALUES (do_register.login, crypt(do_register.password, gen_salt('bf')), do_register.role)
  RETURNING
    * INTO new_user;
  INSERT INTO ctfnote.profile ("id", "username", "discord_id")
    VALUES (new_user.id, do_register.login, do_register.discord_id);
  RETURN (ctfnote_private.new_token (new_user.id))::ctfnote.jwt;
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Username already taken';
END;
$$
LANGUAGE plpgsql
STRICT
SECURITY DEFINER;

