-- Supabase schema for flashcard auth + invites
create table if not exists public.invites (
  code text primary key,
  status text not null default 'active', -- active | used | expired
  expires_at timestamptz,
  max_uses integer not null default 1,
  used_count integer not null default 0,
  used_by_phone text,
  notes text,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key,
  phone text not null,
  password_hash text not null,
  child_age integer,
  invite_code text references public.invites (code),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_invites_status_expires on public.invites (status, expires_at);
create unique index if not exists idx_profiles_phone on public.profiles (phone);

-- trigger to keep updated_at fresh
create or replace function public.refresh_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_invites_updated_at
  before update on public.invites
  for each row execute procedure public.refresh_updated_at();

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.refresh_updated_at();
