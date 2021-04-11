CREATE TABLE ctfnote_private.user (
    "id" serial PRIMARY KEY,
    "login" text NOT NULL UNIQUE,
    "password" text NOT NULL,
    "role" ctfnote.role NOT NULL DEFAULT 'user_guest' ::ctfnote.role
);


CREATE VIEW ctfnote.user AS
SELECT
    "id",
    "login",
    "role"
FROM
    ctfnote_private.user;

COMMENT ON VIEW ctfnote.user IS E'@primaryKey id';

GRANT SELECT ON ctfnote.user TO user_guest;

CREATE FUNCTION ctfnote.set_first_user_admin ()
    RETURNS TRIGGER
    AS $$
BEGIN
    UPDATE
        ctfnote_private.user
    SET
        ROLE = 'user_admin'::ctfnote.role
    WHERE
        id = 1;
    RETURN NULL;
END
$$ STRICT
SECURITY DEFINER
LANGUAGE plpgsql;

CREATE FUNCTION ctfnote_private.current_user_id ()
    RETURNS integer
    AS $$
    SELECT
        nullif (current_setting('jwt.claims.user_id', TRUE), '')::integer;

$$
LANGUAGE sql
STABLE;

GRANT EXECUTE ON FUNCTION ctfnote_private.current_user_id () TO user_guest;

CREATE TYPE ctfnote.jwt AS (
    user_id integer,
    login text,
    "role" ctfnote.role,
    exp bigint
);

CREATE TYPE ctfnote.me_user AS (
    "login" text,
    "role" ctfnote.role,
    "jwt" ctfnote.jwt
);

CREATE FUNCTION ctfnote.me ()
    RETURNS ctfnote.me_user
    AS $$
DECLARE
    me ctfnote."user";
BEGIN
    SELECT
        * INTO me
    FROM
        ctfnote."user"
    WHERE
        id = ctfnote_private.current_user_id ()
    LIMIT 1;
    IF me IS NOT NULL THEN
        RETURN (me."login",
            me."role",
            (me."id",
                me."login",
                me."role",
                extract(epoch FROM (now() + interval '30 days')))::ctfnote.jwt)::ctfnote.me_user;
    ELSE
        RETURN NULL;
    END IF;
END;
$$
LANGUAGE plpgsql
STRICT STABLE
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote.me () TO user_anonymous;


/*
CREATE FUNCTION ctfnote.me ()
 RETURNS ctfnote_private.user
 AS $$
 SELECT
 *
 FROM
 ctfnote_private.user
 WHERE
 id = current_setting('jwt.claims.user_id', TRUE)::int
 LIMIT 1
$$
LANGUAGE sql
SECURITY DEFINER STABLE;
 */
CREATE TRIGGER trigger_first_user
    AFTER INSERT ON ctfnote_private.user
    FOR EACH ROW
    WHEN (NEW.id = 1)
    EXECUTE PROCEDURE ctfnote.set_first_user_admin ();

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- REGISTER AND LOGIN FUNCTIONS
CREATE FUNCTION ctfnote.register (LOGIN text, PASSWORD text)
    RETURNS ctfnote.jwt
    AS $$
DECLARE
    "user" ctfnote_private.user;
    isFirst boolean;
BEGIN
    SELECT
        (count(id) = 0) INTO isFirst
    FROM
        ctfnote_private.user;
    INSERT INTO ctfnote_private.user (login, PASSWORD, ROLE)
        VALUES (login, crypt(PASSWORD, gen_salt('bf')), CASE WHEN (isFirst) THEN
                'user_admin'::ctfnote.role
            ELSE
                'user_guest'::ctfnote.role
            END)
    RETURNING
        * INTO "user";
    RETURN ("user".id,
        "user".login,
        "user".role,
        extract(epoch FROM (now() + interval '30 days')))::ctfnote.jwt;
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
    c_user ctfnote_private.user;
BEGIN
    SELECT
        * INTO c_user
    FROM
        ctfnote_private.user
    WHERE
        "user"."login" = "login"."login";
    IF c_user."password" = crypt("password", c_user."password") THEN
        RETURN (c_user."id",
            c_user."login",
            c_user."role",
            extract(epoch FROM (now() + interval '30 days')))::ctfnote.jwt;
    ELSE
        RETURN NULL;
    END IF;
END;
$$
LANGUAGE plpgsql
STRICT
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote.login (text, text) TO user_anonymous;

