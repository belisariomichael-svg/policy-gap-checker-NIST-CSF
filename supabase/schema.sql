-- Run this once in Supabase: SQL Editor > New query > paste > Run.
-- Stores saved reports (NOT the policy text). Each user can only see and change their own rows.

create table if not exists public.reports (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title       text not null check (char_length(title) between 1 and 100),
  score       integer not null check (score between 0 and 100),
  counts      jsonb not null,
  result      jsonb not null,
  created_at  timestamptz not null default now()
);

create index if not exists reports_user_created_idx on public.reports (user_id, created_at desc);

alter table public.reports enable row level security;

create policy "Users can read own reports"
  on public.reports for select to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own reports"
  on public.reports for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Users can delete own reports"
  on public.reports for delete to authenticated
  using (auth.uid() = user_id);
