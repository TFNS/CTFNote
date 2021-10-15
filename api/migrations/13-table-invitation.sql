CREATE TABLE ctfnote.invitation (
    ctf_id int NOT NULL REFERENCES ctfnote.ctf (id) ON DELETE CASCADE,
    profile_id int NOT NULL REFERENCES ctfnote.profile (id)  ON DELETE CASCADE,
    PRIMARY KEY (ctf_id, profile_id)
);

CREATE INDEX ON "ctfnote"."invitation" ("ctf_id");

CREATE INDEX ON "ctfnote"."invitation" ("profile_id");

GRANT SELECT ON TABLE ctfnote.invitation TO user_guest;

GRANT DELETE ON TABLE ctfnote.invitation TO user_member;

GRANT INSERT ON TABLE ctfnote.invitation TO user_member;
