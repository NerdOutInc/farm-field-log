-- Farm Field Log: field_logs table
-- Run this once in the Supabase SQL Editor (or with `supabase db push`).

create table public.field_logs (
  id          uuid primary key default gen_random_uuid(),
  -- Defaults to the signed-in user, so the app never has to send user_id.
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title       text not null check (char_length(title) between 1 and 200),
  notes       text not null default '',
  category    text not null check (
                category in ('scouting', 'planting', 'spraying', 'harvest', 'maintenance', 'other')
              ),
  occurred_at timestamptz not null default now(),
  latitude    double precision check (latitude between -90 and 90),
  longitude   double precision check (longitude between -180 and 180),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  -- A location is either fully set or not set at all.
  constraint field_logs_location_complete check ((latitude is null) = (longitude is null))
);

comment on table public.field_logs is 'Journal entries recorded by farmers. One row per activity.';

-- The dashboard lists a user's logs newest-first, optionally filtered by category.
create index field_logs_user_occurred_at_idx on public.field_logs (user_id, occurred_at desc);
create index field_logs_user_category_occurred_at_idx on public.field_logs (user_id, category, occurred_at desc);

-- Keep updated_at current on every update.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger field_logs_set_updated_at
  before update on public.field_logs
  for each row execute function public.set_updated_at();

-- Row Level Security: the database itself guarantees each user only sees and
-- changes their own rows, no matter what the application code does.
alter table public.field_logs enable row level security;

create policy "Users can read their own field logs"
  on public.field_logs for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own field logs"
  on public.field_logs for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own field logs"
  on public.field_logs for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own field logs"
  on public.field_logs for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Only signed-in users can reach the table through the Supabase API.
revoke all on public.field_logs from anon;
grant select, insert, update, delete on public.field_logs to authenticated;
