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

CREATE FUNCTION ctfnote.delete_user (user_id int)
  RETURNS ctfnote.user_response
  AS $$
  DELETE FROM ctfnote_private.user
  WHERE "user".id = user_id
  RETURNING (id,
    login,
    ROLE);

$$
LANGUAGE SQL
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote.delete_user(int) TO user_admin;

