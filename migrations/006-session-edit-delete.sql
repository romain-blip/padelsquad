-- ============================================================
-- 🎾 PADELSQUAD — Migration 006: Edit/Delete sessions
-- ============================================================

-- Allow creators to update their own sessions
create policy "Creators can update own sessions"
  on public.sessions for update using (auth.uid() = creator_id);

-- Allow creators to delete their own sessions
create policy "Creators can delete own sessions"
  on public.sessions for delete using (auth.uid() = creator_id);
