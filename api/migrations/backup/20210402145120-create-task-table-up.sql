CREATE TABLE ctfnote.task (
    "id" serial PRIMARY KEY,
    "title" text NOT NULL,
    "description" text,
    "category" text,
    "solved" boolean DEFAULT FALSE,
    "flag" text,
    "pad_url" text,
    "ctf_id" integer REFERENCES ctfnote.ctf (id) NOT NULL
);

CREATE INDEX ON ctfnote.task (ctf_id);

COMMENT ON COLUMN ctfnote.task.id IS E'
Primary identifier';

COMMENT ON COLUMN ctfnote.task.description IS E'
Short description for the task
';

COMMENT ON COLUMN ctfnote.task.category IS E'
Category for the task
';

COMMENT ON COLUMN ctfnote.task.solved IS E'
Indicate if the task is solved
';

COMMENT ON COLUMN ctfnote.task.flag IS E'
Flag for the task 
';

COMMENT ON COLUMN ctfnote.task.pad_url IS E'
Url used for pad iframe
';

COMMENT ON COLUMN ctfnote.task.ctf_id IS E'
Parent CTF
';

GRANT SELECT ON TABLE ctfnote.task TO user_guest;

GRANT UPDATE (title, description, category, solved, flag) ON TABLE ctfnote.task TO user_guest;

GRANT DELETE ON TABLE ctfnote.task TO user_guest;

GRANT usage ON SEQUENCE ctfnote.task_id_seq
    TO user_guest;

CREATE FUNCTION ctfnote_private.create_task (title text, description text, category text, solved boolean, flag text, pad_url text, ctf_id int)
    RETURNS ctfnote.task
    AS $$
    INSERT INTO ctfnote.task (title, description, category, solved, flag, pad_url, ctf_id)
        VALUES (title, description, category, solved, flag, pad_url, ctf_id)
    RETURNING
        *;

$$
LANGUAGE SQL
SECURITY DEFINER;


GRANT EXECUTE ON FUNCTION ctfnote_private.create_task (text, text, text, boolean, text, text, int) TO user_guest;
