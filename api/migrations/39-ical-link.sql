ALTER TABLE ctfnote.settings
  ADD COLUMN "ical_password" TEXT DEFAULT md5(random()::text);

GRANT SELECT ("ical_password") ON ctfnote.settings TO user_guest;

