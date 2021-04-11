/* Replace with your SQL commands */
CREATE FUNCTION ctfnote.guest ()
    RETURNS SETOF ctfnote.user
    AS $$
    SELECT
        *
    FROM
        ctfnote.user
    WHERE
        ctfnote.user.role = 'user_guest'::ctfnote.role
$$
LANGUAGE SQL
STABLE;

GRANT EXECUTE ON FUNCTION ctfnote.guest TO user_guest;

