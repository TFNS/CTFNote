CREATE OR REPLACE VIEW ctfnote.users AS
SELECT
  cast("ctfnote"."profile".* as ctfnote.profile),
  "ctfnote_private"."user"."login",
  "ctfnote_private"."user"."role",
  "ctfnote"."profile"."id" as id,
  CONCAT('user-', "ctfnote"."profile"."id") as node_id
FROM
  "ctfnote"."profile"
  INNER JOIN "ctfnote_private"."user" ON "ctfnote_private"."user"."id" = "ctfnote"."profile"."id"
ORDER BY id;

GRANT SELECT ON ctfnote.users TO user_admin;