/* Replace with your SQL commands */
CREATE TABLE ctfnote_private.ctf_credentials (
    ctf_id int REFERENCES ctfnote.ctf (id),
    "credentials" text,
)


CREATE TABLE ctfnote.ctf (
    "id" serial PRIMARY KEY,
    "title" text NOT NULL,
    CHECK ("title" <> ''),
    "weight" float,
    "ctf_url" text,
    "logo_url" text,
    "ctftime_url" text,
    "description" text,
    "start_time" timestamptz,
    "end_time" timestamptz
);


CREATE FUNCTION ctfnote.ctf_credentials (ctf ctfnote.ctf) RETURN text as $$
SELECT credentials FROM ctfnote_private.ctf_credentials WHERE ctf_id = ctf.id 
$$
LANGUAGE SQL STABLE;

GRANT EXECUTE ON FUNCTION ctfnote.ctf_credentials TO user_guest;


CREATE INDEX ON ctfnote.ctf (end_time);

CREATE INDEX ON ctfnote.ctf (start_time);

COMMENT ON COLUMN ctfnote.ctf.id IS E'
Primary identifier
';

COMMENT ON COLUMN ctfnote.ctf.title IS E'
Title for the CTF
';

COMMENT ON COLUMN ctfnote.ctf.weight IS E'
CTFTime weight for the CTF
';

COMMENT ON COLUMN ctfnote.ctf.ctf_url IS E'
Url for the CTF mainpage
';

COMMENT ON COLUMN ctfnote.ctf.logo_url IS E'
Url for the CTF logo
';

COMMENT ON COLUMN ctfnote.ctf.ctftime_url IS E'
CTFTime url for the CTF
';

COMMENT ON COLUMN ctfnote.ctf.description IS E'
Description in markdown for the CTF
';

COMMENT ON COLUMN ctfnote.ctf.credentials IS E'
Credentials in markdown for the CTF
';

COMMENT ON COLUMN ctfnote.ctf.start_time IS E'
Starting time for the CTF
';

COMMENT ON COLUMN ctfnote.ctf.end_time IS E'
Ending time for the CTF
';


GRANT SELECT ON TABLE ctfnote.ctf TO user_guest;

GRANT INSERT (title, weight, ctf_url, logo_url, ctftime_url, description, credentials, start_time, end_time) ON ctfnote.ctf TO user_manager;

GRANT UPDATE (title, weight, ctf_url, logo_url, ctftime_url, description, credentials, start_time, end_time) ON ctfnote.ctf TO user_manager;

GRANT DELETE ON ctfnote.ctf TO user_manager;

GRANT usage ON SEQUENCE ctfnote.ctf_id_seq
    TO user_manager;

