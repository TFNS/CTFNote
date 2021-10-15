
-- Public profile
CREATE TABLE ctfnote.profile (
  "id" int PRIMARY KEY REFERENCES ctfnote_private.user (id) ON DELETE CASCADE,
  "color" text,
  "username" text NOT NULL UNIQUE,
  CHECK ("username" <> ''),
  "description" text NOT NULL default ''
);


-- Virtal column role
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

GRANT EXECUTE ON FUNCTION ctfnote.profile_role (ctfnote.profile) TO user_anonymous;

GRANT SELECT ON ctfnote.profile TO user_guest;

GRANT UPDATE (username, color, description) ON ctfnote.profile TO user_guest;

