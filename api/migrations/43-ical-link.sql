ALTER TABLE ctfnote.settings
  ADD COLUMN "ical_password" TEXT DEFAULT encode(gen_random_bytes(16), 'hex');

GRANT SELECT ("ical_password") ON ctfnote.settings TO user_guest;

