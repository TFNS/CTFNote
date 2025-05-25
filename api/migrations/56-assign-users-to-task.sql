-- Migration: Assign users to tasks by managers (GraphQL integration)
-- This migration introduces GraphQL functions to allow managers to assign/unassign any team member to a task.

-- GraphQL mutation for assign_user_to_task
CREATE OR REPLACE FUNCTION ctfnote.assign_user_to_task(profile_id int, task_id int)
  RETURNS ctfnote.work_on_task
  AS $$
  WITH inserted AS (
    INSERT INTO ctfnote.work_on_task (task_id, profile_id, active)
      VALUES (assign_user_to_task.task_id, assign_user_to_task.profile_id, TRUE)
      ON CONFLICT (task_id, profile_id) DO UPDATE
        SET active = TRUE
      RETURNING *
  )
  SELECT * FROM inserted;
$$
LANGUAGE SQL;

GRANT EXECUTE ON FUNCTION ctfnote.assign_user_to_task(profile_id int, task_id int) TO user_manager;

-- GraphQL mutation for unassign_user_from_task
CREATE OR REPLACE FUNCTION ctfnote.unassign_user_from_task(profile_id int, task_id int)
  RETURNS ctfnote.work_on_task
  AS $$
  WITH updated AS (
    UPDATE ctfnote.work_on_task
      SET active = FALSE
      WHERE task_id = unassign_user_from_task.task_id
        AND profile_id = unassign_user_from_task.profile_id
      RETURNING *
  )
  SELECT * FROM updated;
$$ LANGUAGE SQL;

GRANT EXECUTE ON FUNCTION ctfnote.unassign_user_from_task(profile_id int, task_id int) TO user_manager;
