-- ============================================================
-- 🎾 PADELSQUAD — Migration 007: Auto-increment sessions_played
-- ============================================================
-- Quand une session est passée et un joueur était "accepted",
-- on incrémente son compteur sessions_played.
-- Pour faire ça proprement, on crée une function + cron job.
-- Mais le plus simple: incrémenter quand le status passe à "accepted"
-- ============================================================

-- Function qui incrémente sessions_played quand un joueur est accepté
create or replace function increment_sessions_played()
returns trigger as $$
begin
  if NEW.status = 'accepted' and (OLD.status is null or OLD.status != 'accepted') then
    update profiles
    set sessions_played = coalesce(sessions_played, 0) + 1
    where id = NEW.player_id;
  end if;
  -- Decrement if player leaves (status goes from accepted to something else or row deleted)
  if TG_OP = 'DELETE' and OLD.status = 'accepted' then
    update profiles
    set sessions_played = greatest(coalesce(sessions_played, 0) - 1, 0)
    where id = OLD.player_id;
  end if;
  if TG_OP = 'DELETE' then
    return OLD;
  end if;
  return NEW;
end;
$$ language plpgsql;

-- Trigger on insert/update
drop trigger if exists on_player_accepted on session_players;
create trigger on_player_accepted
  after insert or update on session_players
  for each row execute function increment_sessions_played();

-- Trigger on delete (leave session)
drop trigger if exists on_player_left on session_players;
create trigger on_player_left
  after delete on session_players
  for each row execute function increment_sessions_played();
