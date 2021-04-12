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

GRANT SELECT ON ctfnote.profile TO user_guest;

GRANT UPDATE (username, color) ON ctfnote.profile TO user_guest;

