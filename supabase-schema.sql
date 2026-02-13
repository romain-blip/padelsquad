-- ============================================================
-- 🏸 PADELSQUAD — Schema Supabase
-- ============================================================
-- Copie-colle tout ce fichier dans l'éditeur SQL de Supabase
-- (Dashboard > SQL Editor > New Query > coller > Run)
-- ============================================================

-- 1. PROFILES
-- Étend la table auth.users avec les infos joueur
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  city text,
  dept text,
  level text check (level in ('Débutant', 'Intermédiaire', 'Avancé', 'Compétition')),
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-créer un profil quand un user s'inscrit
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. SESSIONS
create table public.sessions (
  id uuid default gen_random_uuid() primary key,
  creator_id uuid references public.profiles(id) on delete cascade not null,
  city text not null,
  club text default 'À confirmer',
  date date not null,
  time time not null,
  level text check (level in ('Débutant', 'Intermédiaire', 'Avancé', 'Compétition')),
  dept text,
  spots_total integer default 4,
  created_at timestamptz default now()
);

-- 3. SESSION PLAYERS (qui a rejoint quelle session)
create table public.session_players (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.sessions(id) on delete cascade not null,
  player_id uuid references public.profiles(id) on delete cascade not null,
  joined_at timestamptz default now(),
  unique(session_id, player_id)
);

-- 4. REVIEWS (avis entre joueurs)
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  reviewer_id uuid references public.profiles(id) on delete cascade not null,
  reviewed_id uuid references public.profiles(id) on delete cascade not null,
  stars integer not null check (stars >= 1 and stars <= 5),
  text text,
  created_at timestamptz default now(),
  unique(reviewer_id, reviewed_id)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Protège les données : chacun ne peut modifier que ses propres données
-- ============================================================

-- Profiles
alter table public.profiles enable row level security;

create policy "Profiles visibles par tous"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Sessions
alter table public.sessions enable row level security;

create policy "Sessions visibles par tous"
  on public.sessions for select using (true);

create policy "Authenticated users can create sessions"
  on public.sessions for insert with check (auth.uid() = creator_id);

create policy "Creators can update own sessions"
  on public.sessions for update using (auth.uid() = creator_id);

create policy "Creators can delete own sessions"
  on public.sessions for delete using (auth.uid() = creator_id);

-- Session Players
alter table public.session_players enable row level security;

create policy "Session players visible par tous"
  on public.session_players for select using (true);

create policy "Authenticated users can join sessions"
  on public.session_players for insert with check (auth.uid() = player_id);

create policy "Players can leave sessions"
  on public.session_players for delete using (auth.uid() = player_id);

-- Reviews
alter table public.reviews enable row level security;

create policy "Reviews visibles par tous"
  on public.reviews for select using (true);

create policy "Authenticated users can create reviews"
  on public.reviews for insert with check (auth.uid() = reviewer_id);

create policy "Users can update own reviews"
  on public.reviews for update using (auth.uid() = reviewer_id);

-- ============================================================
-- INDEX pour les perfs
-- ============================================================
create index idx_sessions_date on public.sessions(date);
create index idx_sessions_dept on public.sessions(dept);
create index idx_sessions_level on public.sessions(level);
create index idx_session_players_session on public.session_players(session_id);
create index idx_session_players_player on public.session_players(player_id);
create index idx_reviews_reviewed on public.reviews(reviewed_id);
