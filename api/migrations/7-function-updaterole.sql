CREATE FUNCTION ctfnote.update_user_role (user_id int, ROLE ctfnote.role)
  RETURNS ctfnote.role
  AS $$
  UPDATE
    ctfnote_private.user
  SET
    "role" = update_user_role.role
  WHERE
    "user".id = user_id
  RETURNING
    update_user_role.role;

$$
LANGUAGE SQL
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote.update_user_role (int, ctfnote.role) TO user_admin;