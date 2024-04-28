ALTER TABLE ctf ADD COLUMN IF NOT EXISTS discord_event_link text NULL;

GRANT UPDATE (title, weight, ctf_url, logo_url, ctftime_url, description, start_time, end_time, discord_event_link) ON ctfnote.ctf TO user_manager;

CREATE OR REPLACE FUNCTION ctfnote.set_discord_event_link (ctf_id int, link text)
  RETURNS void
  AS $$
    BEGIN
        UPDATE ctfnote.ctf
            SET discord_event_link = link
            WHERE id = ctf_id;
    END
    $$
LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION ctfnote.set_discord_event_link (int, text) TO user_manager;