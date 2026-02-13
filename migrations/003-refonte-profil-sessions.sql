-- ============================================================
-- 🏸 PADELSQUAD — Migration 003: Refonte Profil + Sessions
-- ============================================================
-- Copie-colle dans Supabase > SQL Editor > New Query > Run
-- ============================================================
-- ⚠️ IMPORTANT: Après ce SQL, va dans Supabase > Storage
-- et crée un bucket appelé "avatars" avec Public = ON
-- ============================================================

-- ==========================================
-- PROFIL: Niveau 1-10, type de jeu, ranking
-- ==========================================

-- Remplacer le niveau texte par un niveau numérique 1-10
alter table public.profiles add column if not exists level_num integer default 5 check (level_num >= 1 and level_num <= 10);

-- Type de jeu (optionnel)
alter table public.profiles add column if not exists play_style text check (play_style in ('compétitif', 'loisir', 'mixte'));

-- Compteur de sessions jouées (pour le ranking)
alter table public.profiles add column if not exists sessions_played integer default 0;

-- Avatar obligatoire — on garde la colonne avatar_url existante, on la rendra obligatoire côté front

-- ==========================================
-- SESSIONS: Durée, créneaux, demandes
-- ==========================================

-- Durée en minutes (60, 90, 120)
alter table public.sessions add column if not exists duration integer default 90 check (duration in (60, 90, 120));

-- Remplacer le niveau texte par niveau numérique sur les sessions aussi
alter table public.sessions add column if not exists level_min integer default 1;
alter table public.sessions add column if not exists level_max integer default 10;

-- ==========================================
-- DEMANDES DE REJOINDRE (accept/refus)
-- ==========================================

-- Ajouter un statut sur session_players
alter table public.session_players add column if not exists status text default 'pending' check (status in ('pending', 'accepted', 'rejected'));

-- ==========================================
-- TABLE: Messages (chat de groupe)
-- ==========================================
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.sessions(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now()
);

alter table public.messages enable row level security;

create policy "Messages visibles par les joueurs de la session"
  on public.messages for select using (
    exists (
      select 1 from public.session_players
      where session_players.session_id = messages.session_id
      and session_players.player_id = auth.uid()
      and session_players.status = 'accepted'
    )
    or exists (
      select 1 from public.sessions
      where sessions.id = messages.session_id
      and sessions.creator_id = auth.uid()
    )
  );

create policy "Joueurs acceptés peuvent envoyer des messages"
  on public.messages for insert with check (
    auth.uid() = sender_id
    and (
      exists (
        select 1 from public.session_players
        where session_players.session_id = messages.session_id
        and session_players.player_id = auth.uid()
        and session_players.status = 'accepted'
      )
      or exists (
        select 1 from public.sessions
        where sessions.id = messages.session_id
        and sessions.creator_id = auth.uid()
      )
    )
  );

create index if not exists idx_messages_session on public.messages(session_id);
create index if not exists idx_messages_created on public.messages(created_at);

-- ==========================================
-- UPDATE RLS: session_players avec statut
-- ==========================================

-- Permettre au créateur de la session de mettre à jour le statut
drop policy if exists "Players can leave sessions" on public.session_players;

create policy "Players can leave sessions"
  on public.session_players for delete using (auth.uid() = player_id);

create policy "Session creators can update player status"
  on public.session_players for update using (
    exists (
      select 1 from public.sessions
      where sessions.id = session_players.session_id
      and sessions.creator_id = auth.uid()
    )
  );
