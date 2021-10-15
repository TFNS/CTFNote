CREATE TABLE ctfnote_private.user (
  "id" serial PRIMARY KEY,
  "login" text NOT NULL UNIQUE,
  "password" text NOT NULL,
  "role" ctfnote.role NOT NULL DEFAULT 'user_guest' ::ctfnote.role
);

GRANT SELECT ON ctfnote_private.user TO user_postgraphile;
