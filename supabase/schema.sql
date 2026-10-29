-- gtk-gyakorlo accounts: run in the Supabase SQL Editor on a fresh project.
-- WARNING: it drops and recreates the profiles table, so re-running it deletes every student's profile and progress.
-- Once people have registered, never re-run it; put changes in a separate, non-destructive file (like tickets.sql).
-- Passwords never touch these tables: Supabase Auth stores them as bcrypt hashes.

drop trigger if exists on_auth_user_created on auth.users;
drop table if exists public.profiles cascade;
drop table if exists public.login_failures cascade;
drop function if exists public.is_admin, public.lock_neptun, public.handle_new_user, public.delete_me, public.login_email cascade;

-- The login e-mail doubles as the Drive e-mail: any provider, but never an ELTE address.
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  neptun text unique check (neptun ~ '^[A-Z0-9]{6}$'),
  drive_email text not null check (drive_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and drive_email !~* '@([a-z0-9-]+\.)*elte\.hu$'),
  login_method text not null default 'neptun' check (login_method in ('neptun', 'google')),
  is_admin boolean not null default false,
  consent_at timestamptz,
  drive_clicks int not null default 0,
  drive_clicked_at timestamptz,
  progress jsonb not null default '{}'::jsonb check (pg_column_size(progress) < 200000),
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);
-- One e-mail address belongs to one Neptun code.
create unique index profiles_drive_email_key on public.profiles (lower(drive_email));

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

-- Column grants: nobody can make themselves admin or change their e-mail from the browser.
revoke insert, update, delete on public.profiles from anon, authenticated;
grant update (neptun, consent_at, drive_clicks, drive_clicked_at, progress, last_seen_at)
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

-- Every new sign-up gets a profile row; a duplicate Neptun code or e-mail, or an ELTE address, rejects the sign-up.
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, neptun, drive_email, login_method, consent_at)
  values (
    new.id,
    nullif(upper(new.raw_user_meta_data->>'neptun'), ''),
    new.email,
    case when new.raw_app_meta_data->>'provider' = 'google' then 'google' else 'neptun' end,
    case when new.raw_user_meta_data->>'consent' = 'true' then now() end
  );
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Sign-in with a Neptun code: returns the account's e-mail only when the password is right,
-- so nobody can look up someone's e-mail from their Neptun code. At most 10 misses per code per 15 minutes.
create table public.login_failures (neptun text not null, at timestamptz not null default now());
alter table public.login_failures enable row level security;
revoke all on public.login_failures from anon, authenticated;

create function public.login_email(p_neptun text, p_password text) returns text
language plpgsql security definer set search_path = '' as $$
declare u record;
begin
  delete from public.login_failures where at < now() - interval '1 day';
  if (select count(*) from public.login_failures
      where neptun = upper(p_neptun) and at > now() - interval '15 minutes') >= 10 then
    raise exception 'too many attempts';
  end if;
  select au.email, au.encrypted_password into u
    from public.profiles p join auth.users au on au.id = p.id
    where p.neptun = upper(p_neptun) and p.login_method = 'neptun';
  if u.encrypted_password is not null and u.encrypted_password = extensions.crypt(p_password, u.encrypted_password) then
    return u.email;
  end if;
  insert into public.login_failures (neptun) values (upper(p_neptun));
  return null;
end $$;
revoke execute on function public.login_email(text, text) from public;
grant execute on function public.login_email(text, text) to anon, authenticated;

-- "Fiók törlése": removes the login and, through the cascade, the profile.
create function public.delete_me() returns void
language sql security definer set search_path = '' as $$
  delete from auth.users where id = auth.uid()
$$;
revoke execute on function public.delete_me() from public, anon;
grant execute on function public.delete_me() to authenticated;
