CREATE TABLE ctfnote_private.reset_password_link (
    "id" serial PRIMARY KEY,
    "user_id" int REFERENCES ctfnote_private.user (id) ON DELETE CASCADE,
    "token" uuid,
    "expiration" timestamptz DEFAULT (now() + interval '1 hour')
);

CREATE TYPE ctfnote.reset_password_link_response AS (
    "token" text
);

CREATE FUNCTION ctfnote.create_reset_password_link (user_id int)
    RETURNS ctfnote.reset_password_link_response
    AS $$
DECLARE
    reset_link ctfnote_private.reset_password_link;
BEGIN
    INSERT INTO ctfnote_private.reset_password_link (user_id, token)
        VALUES (create_reset_password_link.user_id, gen_random_uuid ())
    RETURNING
        * INTO reset_link;
    RETURN ROW (reset_link.token::text)::ctfnote.reset_password_link_response;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote.create_reset_password_link (int) TO user_admin;

CREATE FUNCTION ctfnote_private.delete_expired_reset_password_link ()
    RETURNS TRIGGER
    AS $$
BEGIN
    DELETE FROM ctfnote_private.reset_password_link
    WHERE expiration < now()
        OR reset_password_link.user_id = NEW.user_id;
    RETURN NEW;
END
$$
LANGUAGE plpgsql
SECURITY DEFINER;

-- Remove expirated links for each new insertion
CREATE TRIGGER delete_expirated_reset_links
    BEFORE INSERT ON ctfnote_private.reset_password_link
    FOR EACH ROW
    EXECUTE PROCEDURE ctfnote_private.delete_expired_reset_password_link ();

CREATE FUNCTION ctfnote.reset_password ("token" text, "password" text)
    RETURNS ctfnote.jwt
    AS $$
DECLARE
    user_id int;
BEGIN
    SELECT
        user_id INTO user_id
    FROM
        ctfnote_private.reset_password_link
    WHERE
        reset_password_link.token::text = reset_password.token
        AND expiration > now();
    IF user_id IS NOT NULL THEN
        DELETE FROM ctfnote_private.reset_password_link
        WHERE reset_password_link.token::text = reset_password.token;
        UPDATE
            ctfnote_private."user"
        SET
            PASSWORD = crypt(reset_password."password", gen_salt('bf'))
        WHERE
            "user".id = user_id;
        RETURN ctfnote_private.new_token (user_id);
    ELSE
        RAISE EXCEPTION 'Invalid token';
    END IF;
END
$$
LANGUAGE plpgsql
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote.reset_password (text, text) TO user_anonymous;

