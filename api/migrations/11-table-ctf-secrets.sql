CREATE TABLE ctfnote.ctf_secrets (
  id serial PRIMARY KEY,
  "credentials" text
);

GRANT SELECT ON ctfnote.ctf_secrets TO user_guest;

GRANT UPDATE (credentials) ON ctfnote.ctf_secrets TO user_manager;

