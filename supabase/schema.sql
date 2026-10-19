-- gtk-gyakorlo accounts: run once in the Supabase SQL Editor.
-- Passwords never touch this table: Supabase Auth stores them as bcrypt hashes.

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  neptun text unique check (neptun ~ '^[A-Z0-9]{6}$'),
  drive_email text check (drive_email is null or drive_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  login_method text not null default 'neptun' check (login_method in ('neptun', 'google')),
  is_admin boolean not null default false,
  consent_at timestamptz,
  drive_clicks int not null default 0,
  drive_clicked_at timestamptz,
  progress jsonb not null default '{}'::jsonb check (pg_column_size(progress) < 200000),
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Students only ever touch their own row; the admin can read every row.
create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false)
$$;

create policy "read own row, admin reads all" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "update own row" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Column grants: nobody can make themselves admin or rewrite timestamps from the browser.
revoke insert, update, delete on public.profiles from anon, authenticated;
grant update (neptun, drive_email, consent_at, drive_clicks, drive_clicked_at, progress, last_seen_at)
  on public.profiles to authenticated;

-- A Neptun code can be set once (Google users set it after their first sign-in), never changed.
create function public.lock_neptun() returns trigger language plpgsql as $$
begin
  if old.neptun is not null and new.neptun is distinct from old.neptun then
    raise exception 'A Neptun-kód nem módosítható';
  end if;
  return new;
end $$;
create trigger lock_neptun before update on public.profiles
  for each row execute function public.lock_neptun();

-- Every new sign-up gets a profile row, filled from the sign-up form (or from Google).
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
declare google boolean := new.raw_app_meta_data->>'provider' = 'google';
begin
  insert into public.profiles (id, neptun, drive_email, login_method, consent_at)
  values (
    new.id,
    nullif(upper(new.raw_user_meta_data->>'neptun'), ''),
    coalesce(nullif(new.raw_user_meta_data->>'drive_email', ''), case when google then new.email end),
    case when google then 'google' else 'neptun' end,
    case when new.raw_user_meta_data->>'consent' = 'true' then now() end
  );
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- "Fiók törlése": removes the login and, through the cascade, the profile.
create function public.delete_me() returns void
language sql security definer set search_path = '' as $$
  delete from auth.users where id = auth.uid()
$$;
revoke execute on function public.delete_me() from public, anon;
grant execute on function public.delete_me() to authenticated;
