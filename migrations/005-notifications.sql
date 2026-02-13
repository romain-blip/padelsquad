-- ============================================================
-- 🏸 PADELSQUAD — Migration 005: Email Notifications
-- ============================================================
-- Ce SQL crée des triggers qui appellent une Edge Function
-- pour envoyer des emails quand:
-- 1. Quelqu'un demande à rejoindre une session
-- 2. Premier message dans un chat de session
-- ============================================================
-- ⚠️ APRÈS ce SQL, crée l'Edge Function "notify" dans Supabase
-- (voir le fichier notify/index.ts)
-- ============================================================

-- Table pour tracker les notifs envoyées (éviter les doublons)
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  type text not null, -- 'join_request' | 'first_message'
  recipient_id uuid references public.profiles(id) on delete cascade,
  session_id uuid references public.sessions(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete cascade,
  sent_at timestamptz default now(),
  unique(type, recipient_id, session_id, sender_id)
);

alter table public.notifications enable row level security;

create policy "Users can see own notifications"
  on public.notifications for select using (auth.uid() = recipient_id);

create policy "System can insert notifications"
  on public.notifications for insert with check (true);
