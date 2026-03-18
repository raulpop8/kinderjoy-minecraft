-- Run this in your Supabase project → SQL Editor

-- Collections table
create table if not exists public.collections (
  id          uuid    default gen_random_uuid() primary key,
  user_id     uuid    references auth.users(id) on delete cascade not null,
  figurine_id text    not null,
  created_at  timestamptz default now(),

  unique (user_id, figurine_id)
);

-- Row Level Security: users can only read/write their own rows
alter table public.collections enable row level security;

create policy "Users can view own collection"
  on public.collections for select
  using (auth.uid() = user_id);

create policy "Users can insert own collection"
  on public.collections for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own collection"
  on public.collections for delete
  using (auth.uid() = user_id);
