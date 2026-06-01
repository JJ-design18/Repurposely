-- Repurposely Database Schema
-- Run this in Supabase SQL Editor

-- User profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  plan text not null default 'free' check (plan in ('free', 'starter', 'pro', 'agency')),
  generations_used integer not null default 0,
  generations_reset_at timestamp with time zone not null default timezone('utc'::text, now() + interval '1 month'),
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Projects (each generation)
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  youtube_url text not null,
  video_title text not null default 'Untitled',
  transcript text,
  generated_content jsonb,
  status text not null default 'processing' check (status in ('processing', 'completed', 'failed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.projects enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Projects policies
create policy "Users can view own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can insert own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "Users can delete own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes
create index projects_user_id_idx on public.projects(user_id);
create index projects_created_at_idx on public.projects(created_at desc);

-- =====================================================================
-- MIGRATION (2026-06-01): run this block on the EXISTING production DB.
-- Idempotent — safe to re-run.
-- =====================================================================

-- Fix #1: monthly quota reset support
alter table public.profiles
  add column if not exists generations_reset_at timestamp with time zone
  not null default timezone('utc'::text, now() + interval '1 month');

-- Fix #2: allow users to delete their own projects (was silently rejected by RLS)
drop policy if exists "Users can delete own projects" on public.projects;
create policy "Users can delete own projects"
  on public.projects for delete
  using (auth.uid() = user_id);
