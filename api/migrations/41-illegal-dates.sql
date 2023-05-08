UPDATE ctfnote.ctf SET end_time = start_time WHERE end_time < start_time;
ALTER TABLE ctfnote.ctf ADD CONSTRAINT no_illegal_end_time CHECK (end_time >= start_time);
