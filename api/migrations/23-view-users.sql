--
CREATE TYPE ctfnote.user_response AS (
  id int,
  login text,
  ROLE ctfnote.role
);

CREATE VIEW ctfnote.users AS
SELECT
  cast("ctfnote"."profile".* as ctfnote.profile),
  "ctfnote_private"."user"."login",
  "ctfnote_private"."user"."role",
  "ctfnote"."profile"."id" as id,
  CONCAT('user-', "ctfnote"."profile"."id") as node_id
FROM
  "ctfnote"."profile"
  INNER JOIN "ctfnote_private"."user" ON "ctfnote_private"."user"."id" = "ctfnote"."profile"."id";

GRANT SELECT ON ctfnote.users TO user_admin;

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

GRANT EXECUTE ON FUNCTION ctfnote.delete_user (int) TO user_admin;

