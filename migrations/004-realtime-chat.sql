-- ============================================================
-- 🏸 PADELSQUAD — Migration 004: Enable Realtime for Chat
-- ============================================================
-- Copie-colle dans Supabase > SQL Editor > New Query > Run
-- ============================================================

-- Active le realtime sur la table messages pour le chat en direct
alter publication supabase_realtime add table public.messages;
