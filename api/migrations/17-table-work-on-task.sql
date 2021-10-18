CREATE TABLE ctfnote.work_on_task (
    task_id int NOT NULL REFERENCES ctfnote.task (id) ON DELETE CASCADE,
    profile_id int NOT NULL REFERENCES ctfnote.profile (id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, profile_id)
);

CREATE INDEX ON "ctfnote"."work_on_task" ("task_id");

CREATE INDEX ON "ctfnote"."work_on_task" ("profile_id");

GRANT SELECT ON TABLE ctfnote.work_on_task TO user_guest;

