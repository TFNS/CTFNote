-- Fix relations

-- Guests
INSERT INTO ctfnote.invitation(ctf_id, profile_id)
SELECT ref_ctf.new, ref_users.new
FROM   migration.ctf_guests_user
JOIN   migration.ref_ctf   ON "ctfId" = ref_ctf.old
JOIN   migration.ref_users ON "userId" = ref_users.old;


-- Work on task
INSERT INTO ctfnote.work_on_task(task_id, profile_id)
SELECT ref_tasks.new, ref_users.new
FROM   migration.task_players_user
JOIN   migration.ref_tasks ON "taskId" = ref_tasks.old
JOIN   migration.ref_users ON "userId" = ref_users.old;
