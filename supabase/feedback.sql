-- gtk-gyakorlo feedback (Visszajelzés): the mandatory feedback the site asks for every 3 days, from signed-in students
-- and from signed-out visitors (one random id per device). Run once in the Supabase SQL Editor, after schema.sql.
-- Safe to re-run: it never deletes existing feedback or accounts.

create table if not exists public.feedback (
  id bigint generated always as identity primary key,
  user_id uuid default auth.uid() references auth.users on delete cascade,
  device_id text not null check (device_id ~ '^[0-9a-f-]{36}$'),
  rating smallint not null check (rating between 1 and 5),
  message text not null check (char_length(btrim(message)) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists feedback_user_id on public.feedback (user_id);
create index if not exists feedback_device_id on public.feedback (device_id);

alter table public.feedback enable row level security;

-- Anyone may send feedback, but only as themselves (signed out: no user id). Students read only their own (to know
-- when they last answered); the admin reads all.
drop policy if exists "send own feedback" on public.feedback;
create policy "send own feedback" on public.feedback
  for insert to anon, authenticated with check (user_id is not distinct from auth.uid());
drop policy if exists "read own feedback, admin reads all" on public.feedback;
create policy "read own feedback, admin reads all" on public.feedback
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

revoke all on public.feedback from anon, authenticated;
grant select on public.feedback to authenticated;
grant insert (device_id, rating, message) on public.feedback to anon, authenticated;

-- Signed-out visitors can write, so: at most 3 per device per hour and 300 in total per hour.
create or replace function public.limit_feedback() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if (select count(*) from public.feedback where device_id = new.device_id and created_at > now() - interval '1 hour') >= 3
     or (select count(*) from public.feedback where created_at > now() - interval '1 hour') >= 300 then
    raise exception 'too many feedback';
  end if;
  return new;
end $$;
drop trigger if exists limit_feedback on public.feedback;
create trigger limit_feedback before insert on public.feedback
  for each row execute function public.limit_feedback();
