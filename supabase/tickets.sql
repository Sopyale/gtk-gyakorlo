-- gtk-gyakorlo tickets: questions and requests sent from a signed-in account. Run once in the Supabase SQL Editor,
-- after schema.sql. Safe to re-run: it never deletes existing tickets or accounts.

create table if not exists public.tickets (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  kind text not null check (kind in ('kerdes', 'keres', 'hiba')),
  message text not null check (char_length(btrim(message)) between 1 and 2000),
  done boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists tickets_user_id on public.tickets (user_id);

alter table public.tickets enable row level security;

-- Students send tickets and see only their own; the admin sees all and marks them done.
drop policy if exists "send own ticket" on public.tickets;
create policy "send own ticket" on public.tickets
  for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "read own ticket, admin reads all" on public.tickets;
create policy "read own ticket, admin reads all" on public.tickets
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
drop policy if exists "admin marks done" on public.tickets;
create policy "admin marks done" on public.tickets
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

revoke all on public.tickets from anon, authenticated;
grant select on public.tickets to authenticated;
grant insert (kind, message) on public.tickets to authenticated;
grant update (done) on public.tickets to authenticated;

-- At most 5 tickets per account per hour, so nobody can flood the admin list.
create or replace function public.limit_tickets() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if (select count(*) from public.tickets where user_id = new.user_id and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'too many tickets';
  end if;
  return new;
end $$;
drop trigger if exists limit_tickets on public.tickets;
create trigger limit_tickets before insert on public.tickets
  for each row execute function public.limit_tickets();
