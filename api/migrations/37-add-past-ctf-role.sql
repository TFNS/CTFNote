DROP ROLE user_past_ctfs;

CREATE ROLE user_past_ctfs;

REVOKE user_guest FROM user_member;

GRANT user_guest TO user_past_ctfs;

GRANT user_past_ctfs TO user_member;

ALTER TYPE ctfnote.role ADD VALUE IF NOT EXISTS 'user_past_ctfs';