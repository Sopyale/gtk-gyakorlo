-- gtk-gyakorlo ticket replies: the admin and the ticket's author write back and forth under a ticket.
-- Run once in the Supabase SQL Editor, after tickets.sql. Safe to re-run: it never deletes existing data.

create table if not exists public.ticket_replies (
  id bigint generated always as identity primary key,
  ticket_id bigint not null references public.tickets on delete cascade,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  from_admin boolean not null default false,
  message text not null check (char_length(btrim(message)) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists ticket_replies_ticket_id on public.ticket_replies (ticket_id);

alter table public.ticket_replies enable row level security;

-- Only the ticket's author and the admin can read or write its replies.
drop policy if exists "read replies of own ticket, admin reads all" on public.ticket_replies;
create policy "read replies of own ticket, admin reads all" on public.ticket_replies
  for select to authenticated using (
    public.is_admin() or exists (select 1 from public.tickets t where t.id = ticket_id and t.user_id = auth.uid()));
drop policy if exists "reply to own ticket, admin replies to all" on public.ticket_replies;
create policy "reply to own ticket, admin replies to all" on public.ticket_replies
  for insert to authenticated with check (
    user_id = auth.uid()
    and (public.is_admin() or exists (select 1 from public.tickets t where t.id = ticket_id and t.user_id = auth.uid())));

revoke all on public.ticket_replies from anon, authenticated;
grant select on public.ticket_replies to authenticated;
grant insert (ticket_id, message) on public.ticket_replies to authenticated;

-- The server decides who wrote a reply, at most 20 replies per account per hour,
-- and a student's reply reopens a ticket the admin had marked done.
create or replace function public.on_ticket_reply() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if (select count(*) from public.ticket_replies where user_id = new.user_id and created_at > now() - interval '1 hour') >= 20 then
    raise exception 'too many tickets';
  end if;
  new.from_admin := public.is_admin();
  if not new.from_admin then
    update public.tickets set done = false where id = new.ticket_id;
  end if;
  return new;
end $$;
drop trigger if exists on_ticket_reply on public.ticket_replies;
create trigger on_ticket_reply before insert on public.ticket_replies
  for each row execute function public.on_ticket_reply();
