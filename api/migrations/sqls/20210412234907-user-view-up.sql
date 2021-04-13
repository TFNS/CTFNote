/* Replace with your SQL commands */
CREATE TYPE ctfnote.user_response AS (
  id int,
  login text,
  ROLE ctfnote.role
);

CREATE FUNCTION ctfnote.users ()
  RETURNS SETOF ctfnote.user_response
  AS $$
  SELECT
    "id",
    "login",
    "role"
  FROM
    ctfnote_private.user
$$ STABLE
LANGUAGE SQL
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote.users () TO user_admin;

