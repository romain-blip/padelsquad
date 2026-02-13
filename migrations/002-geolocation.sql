-- ============================================================
-- 🏸 PADELSQUAD — Migration: Géolocalisation
-- ============================================================
-- Copie-colle dans Supabase > SQL Editor > Run
-- ============================================================

-- Ajouter lat/lng sur les sessions
alter table public.sessions add column if not exists latitude double precision;
alter table public.sessions add column if not exists longitude double precision;

-- Ajouter lat/lng sur les profils (position du joueur)
alter table public.profiles add column if not exists latitude double precision;
alter table public.profiles add column if not exists longitude double precision;

-- Index pour les futures requêtes géo
create index if not exists idx_sessions_lat on public.sessions(latitude);
create index if not exists idx_sessions_lng on public.sessions(longitude);
