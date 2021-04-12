CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE ctfnote_private.reset_password_link (
    "id" serial PRIMARY KEY,
    "user_id" int REFERENCES ctfnote_private.user (id),
    "token" uuid,
    "expiration" timestamptz DEFAULT (now() + interval '1 hour')
);

CREATE FUNCTION ctfnote.create_reset_password_link (user_id int)
    RETURNS uuid
    AS $$
DECLARE
    reset_link ctfnote_private.reset_password_link;
BEGIN
    INSERT INTO ctfnote_private.reset_password_link (user_id, token)
        VALUES (user_id, token)
    RETURNING
        * INTO reset_link;
    RETURN reset_link.token;
END
$$
LANGUAGE plpgsql
SECURITY DEFINER;

CREATE FUNCTION ctfnote_private.delete_expired_reset_password_link ()
    RETURNS TRIGGER
    AS $$
BEGIN
    DELETE FROM ctfnote_private.reset_password_link
    WHERE expiration > now()
    RETURNING
        *;
END
$$
LANGUAGE plpgsql
SECURITY DEFINER;

-- Remove expirated links for each new insertion
CREATE TRIGGER delete_expirated_reset_links
    BEFORE INSERT ON ctfnote_private.reset_password_link
    FOR EACH ROW
    EXECUTE PROCEDURE ctfnote_private.delete_expired_reset_password_link ();

GRANT EXECUTE ON FUNCTION ctfnote.create_reset_password_link (int) TO user_admin;

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
        reset_password_link.token = reset_password.token::uuid
        AND expiration < now();
    IF user_id <> NULL THEN
        UPDATE
            ctfnote_private.user
        SET
            "user".password = crypt(reset_password.password, gen_salt('bf'))
        WHERE
            "user".id = user_id;
        RETURN ctfnote_private.new_token (user_id);
    ELSE
        RETURN NULL;
    END IF;
END
$$
LANGUAGE plpgsql
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote.reset_password (text, text) TO user_anonymous;

