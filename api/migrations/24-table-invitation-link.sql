CREATE TABLE ctfnote_private.invitation_link (
  "id" serial PRIMARY KEY,
  "role" ctfnote.role NOT NULL,
  "token" uuid,
  "expiration" timestamptz DEFAULT (now() + interval '1 hour')
);

CREATE TYPE ctfnote.invitation_link_response AS (
  "token" text
);

CREATE FUNCTION ctfnote.create_invitation_link ("role" ctfnote.role)
  RETURNS ctfnote.invitation_link_response
  AS $$
DECLARE
  invitation_link ctfnote_private.invitation_link;
BEGIN
  INSERT INTO ctfnote_private.invitation_link ("role", "token")
    VALUES (create_invitation_link.role, gen_random_uuid ())
  RETURNING
    * INTO invitation_link;
  RETURN ROW (invitation_link.token::text)::ctfnote.invitation_link_response;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote.create_invitation_link (ctfnote.role) TO user_admin;

CREATE FUNCTION ctfnote_private.delete_expired_invitation_link ()
  RETURNS TRIGGER
  AS $$
BEGIN
  DELETE FROM ctfnote_private.invitation_link
  WHERE expiration < now();
  RETURN NEW;
END
$$
LANGUAGE plpgsql
SECURITY DEFINER;

-- Remove expirated links for each new insertion
CREATE TRIGGER delete_expirated_invitation_links
  BEFORE INSERT ON ctfnote_private.invitation_link
  FOR EACH ROW
  EXECUTE PROCEDURE ctfnote_private.delete_expired_invitation_link ();


/**/
CREATE FUNCTION ctfnote.register_with_token ("token" text, "login" text, "password" text)
  RETURNS ctfnote.jwt
  AS $$
DECLARE
  invitation_role ctfnote.role;
BEGIN
  SELECT
    ROLE INTO invitation_role
  FROM
    ctfnote_private.invitation_link
  WHERE
    invitation_link.token::text = register_with_token.token
    AND expiration > now();
  IF invitation_role IS NOT NULL THEN
    DELETE FROM ctfnote_private.invitation_link
    WHERE invitation_link.token::text = register_with_token.token;
    RETURN ctfnote_private.do_register (register_with_token.login, register_with_token.password, invitation_role);
  ELSE
    RAISE EXCEPTION 'Invalid token';
  END IF;
END
$$
LANGUAGE plpgsql
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote.register_with_token (text, text, text) TO user_anonymous;



