ALTER TABLE ctfnote.ctf ADD CONSTRAINT no_illegal_end_time CHECK (end_time >= start_time);
