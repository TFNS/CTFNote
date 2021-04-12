CREATE TYPE ctfnote.role AS ENUM (
  'user_guest',
  'user_member',
  'user_manager',
  'user_admin'
);

-- Private profile
CREATE TABLE ctfnote_private.user (
  "id" serial PRIMARY KEY,
  "login" text NOT NULL UNIQUE,
  "password" text NOT NULL,
  "role" ctfnote.role NOT NULL DEFAULT 'user_guest' ::ctfnote.role
);

GRANT SELECT ON ctfnote_private.user TO user_postgraphile;

-- Public profile
CREATE TABLE ctfnote.profile (
  "id" int PRIMARY KEY REFERENCES ctfnote_private.user (id),
  "color" text DEFAULT '#333333',
  "username" text
);

CREATE FUNCTION ctfnote.guests ()
  RETURNS SETOF ctfnote.profile
  AS $$
  SELECT
    (profile."id",
      profile."color",
      profile."username")
  FROM
    ctfnote.profile
    INNER JOIN ctfnote_private.user ON profile.id = "user".id
  WHERE
    "user".role = 'user_guest'::ctfnote.role;

$$
LANGUAGE SQL
SECURITY DEFINER STABLE;

GRANT EXECUTE ON FUNCTION ctfnote.guests TO user_guest;

CREATE FUNCTION ctfnote.profile_role (profile ctfnote.profile)
  RETURNS ctfnote.role
  AS $$
  SELECT
    "role"
  FROM
    ctfnote_private.user
  WHERE
    "user".id = profile.id;

$$ STABLE
LANGUAGE SQL
SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ctfnote.profile_role (ctfnote.profile) TO user_guest;

GRANT SELECT ON ctfnote.profile TO user_guest;

GRANT UPDATE (username, color) ON ctfnote.profile TO user_guest;

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

