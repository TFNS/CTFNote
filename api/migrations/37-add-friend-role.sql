DROP ROLE IF EXISTS user_friend;

CREATE ROLE user_friend;

REVOKE user_guest FROM user_member;

GRANT user_guest TO user_friend;

GRANT user_friend TO user_member;

ALTER TYPE ctfnote.role ADD VALUE IF NOT EXISTS 'user_friend';