-- CTF SECRET
ALTER TABLE ctfnote.ctf_secrets ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_ctf_secret ON ctfnote.ctf_secrets
  FOR SELECT TO user_guest
    USING (ctfnote_private.is_member ()
      OR ctfnote_private.can_play_ctf (id));

CREATE POLICY manager_update_ctf_secret ON ctfnote.ctf_secrets
  FOR UPDATE TO user_manager
    USING (TRUE);

-- WORK ON TASK
ALTER TABLE ctfnote.work_on_task ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_work_on_task ON ctfnote.work_on_task
  FOR SELECT TO user_guest
    USING (ctfnote_private.can_play_task (task_id));

CREATE POLICY member_select_work_on_task ON ctfnote.work_on_task
  FOR SELECT TO user_member
    USING (TRUE);

-- TASK
ALTER TABLE ctfnote.task ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_task ON ctfnote.task
  FOR ALL TO user_guest
    USING (ctfnote_private.can_play_ctf (ctf_id));

-- PROFILE
ALTER TABLE ctfnote.profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_profile ON ctfnote.profile
  FOR SELECT TO user_guest
    USING (TRUE);

CREATE POLICY update_profile ON ctfnote.profile
  FOR UPDATE TO user_guest
    USING (ctfnote_private.is_admin ()
      OR id = ctfnote_private.user_id ());

CREATE POLICY delete_profile ON ctfnote.profile
  FOR DELETE TO user_admin
    USING (TRUE);

