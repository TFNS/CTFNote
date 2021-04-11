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
  "password" text NOT NULL
);

GRANT SELECT ON ctfnote_private.user TO user_postgraphile;
GRANT SELECT ON ctfnote.profile TO user_admin;
GRANT UPDATE(login) ON ctfnote.profile TO user_admin;


-- Public profile

CREATE TABLE ctfnote.profile (
  "id" int PRIMARY KEY REFERENCES ctfnote_private.user (id),
  "username" text,
  "role" ctfnote.role NOT NULL DEFAULT 'user_guest' ::ctfnote.role
);

CREATE INDEX ON ctfnote.profile (role);
GRANT SELECT ON ctfnote.profile TO user_guest;
GRANT UPDATE(username) ON ctfnote.profile TO user_guest;
GRANT UPDATE(username, "role") ON ctfnote.profile TO user_admin;
