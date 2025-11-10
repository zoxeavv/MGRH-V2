-- Supabase RLS helpers & policies for the multi-tenant SaaS

set check_function_bodies = off;

create or replace function public.is_member(org_id uuid, uid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from memberships m
      join profiles p on p.id = m.profile_id
    where m.organization_id = org_id
      and m.status = 'active'
      and p.user_id = uid
  );
$$;

create or replace function public.has_org_role(org_id uuid, uid uuid, roles text[])
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from memberships m
      join profiles p on p.id = m.profile_id
    where m.organization_id = org_id
      and m.status = 'active'
      and p.user_id = uid
      and m.role = any(roles)
  );
$$;

create or replace function public.current_profile_id()
returns uuid
language sql
security definer
set search_path = public
as $$
  select id
  from profiles
  where user_id = auth.uid()
  limit 1;
$$;

-- Ensure RLS is enabled on all domain tables
alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.clients enable row level security;
alter table public.offers enable row level security;
alter table public.offer_versions enable row level security;
alter table public.offer_items enable row level security;
alter table public.templates enable row level security;
alter table public.template_assets enable row level security;
alter table public.notes enable row level security;
alter table public.tasks enable row level security;
alter table public.activity_log enable row level security;

-- Organizations
drop policy if exists "Organizations service role" on public.organizations;
create policy "Organizations service role" on public.organizations
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Organizations select members" on public.organizations;
create policy "Organizations select members" on public.organizations
  for select
  using (public.is_member(id, auth.uid()));

drop policy if exists "Organizations update admins" on public.organizations;
create policy "Organizations update admins" on public.organizations
  for update
  using (public.has_org_role(id, auth.uid(), array['owner','admin']::text[]))
  with check (public.has_org_role(id, auth.uid(), array['owner','admin']::text[]));

drop policy if exists "Organizations insert authenticated" on public.organizations;
create policy "Organizations insert authenticated" on public.organizations
  for insert
  with check (auth.role() = 'authenticated');

-- Profiles
drop policy if exists "Profiles service role" on public.profiles;
create policy "Profiles service role" on public.profiles
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Profiles select shared org" on public.profiles;
create policy "Profiles select shared org" on public.profiles
  for select
  using (
    profiles.user_id = auth.uid()
    or exists (
      select 1
      from memberships m_target
        join memberships m_viewer on m_viewer.organization_id = m_target.organization_id
      where m_target.profile_id = profiles.id
        and m_viewer.profile_id = public.current_profile_id()
        and m_target.status = 'active'
        and m_viewer.status = 'active'
    )
  );

drop policy if exists "Profiles update self" on public.profiles;
create policy "Profiles update self" on public.profiles
  for update
  using (profiles.user_id = auth.uid())
  with check (profiles.user_id = auth.uid());

drop policy if exists "Profiles insert service role" on public.profiles;
create policy "Profiles insert service role" on public.profiles
  for insert
  with check (auth.role() = 'service_role');

-- Memberships
drop policy if exists "Memberships service role" on public.memberships;
create policy "Memberships service role" on public.memberships
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Memberships select members" on public.memberships;
create policy "Memberships select members" on public.memberships
  for select
  using (public.is_member(organization_id, auth.uid()));

drop policy if exists "Memberships insert admins" on public.memberships;
create policy "Memberships insert admins" on public.memberships
  for insert
  with check (public.has_org_role(organization_id, auth.uid(), array['owner','admin']::text[]));

drop policy if exists "Memberships update admins" on public.memberships;
create policy "Memberships update admins" on public.memberships
  for update
  using (public.has_org_role(organization_id, auth.uid(), array['owner','admin']::text[]))
  with check (public.has_org_role(organization_id, auth.uid(), array['owner','admin']::text[]));

drop policy if exists "Memberships delete owners" on public.memberships;
create policy "Memberships delete owners" on public.memberships
  for delete
  using (public.has_org_role(organization_id, auth.uid(), array['owner']::text[]));

-- Clients
drop policy if exists "Clients service role" on public.clients;
create policy "Clients service role" on public.clients
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Clients select members" on public.clients;
create policy "Clients select members" on public.clients
  for select
  using (public.is_member(organization_id, auth.uid()));

drop policy if exists "Clients insert members" on public.clients;
create policy "Clients insert members" on public.clients
  for insert
  with check (public.is_member(organization_id, auth.uid()));

drop policy if exists "Clients update members" on public.clients;
create policy "Clients update members" on public.clients
  for update
  using (public.is_member(organization_id, auth.uid()))
  with check (public.is_member(organization_id, auth.uid()));

drop policy if exists "Clients delete admins" on public.clients;
create policy "Clients delete admins" on public.clients
  for delete
  using (public.has_org_role(organization_id, auth.uid(), array['owner','admin']::text[]));

-- Offers
drop policy if exists "Offers service role" on public.offers;
create policy "Offers service role" on public.offers
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Offers select members" on public.offers;
create policy "Offers select members" on public.offers
  for select
  using (public.is_member(organization_id, auth.uid()));

drop policy if exists "Offers insert members" on public.offers;
create policy "Offers insert members" on public.offers
  for insert
  with check (public.is_member(organization_id, auth.uid()));

drop policy if exists "Offers update members" on public.offers;
create policy "Offers update members" on public.offers
  for update
  using (public.is_member(organization_id, auth.uid()))
  with check (public.is_member(organization_id, auth.uid()));

drop policy if exists "Offers delete admins" on public.offers;
create policy "Offers delete admins" on public.offers
  for delete
  using (public.has_org_role(organization_id, auth.uid(), array['owner','admin']::text[]));

-- Offer versions
drop policy if exists "Offer versions service role" on public.offer_versions;
create policy "Offer versions service role" on public.offer_versions
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Offer versions select members" on public.offer_versions;
create policy "Offer versions select members" on public.offer_versions
  for select
  using (public.is_member(
    (select organization_id from offers where offers.id = offer_versions.offer_id),
    auth.uid()
  ));

drop policy if exists "Offer versions write members" on public.offer_versions;
create policy "Offer versions write members" on public.offer_versions
  for all
  using (
    public.is_member(
      (select organization_id from offers where offers.id = offer_versions.offer_id),
      auth.uid()
    )
  )
  with check (
    public.is_member(
      (select organization_id from offers where offers.id = offer_versions.offer_id),
      auth.uid()
    )
  );

-- Offer items
drop policy if exists "Offer items service role" on public.offer_items;
create policy "Offer items service role" on public.offer_items
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Offer items members" on public.offer_items;
create policy "Offer items members" on public.offer_items
  for all
  using (
    public.is_member(
      (select o.organization_id
         from offers o
         join offer_versions ov on ov.id = offer_items.offer_version_id
        where o.id = ov.offer_id),
      auth.uid()
    )
  )
  with check (
    public.is_member(
      (select o.organization_id
         from offers o
         join offer_versions ov on ov.id = offer_items.offer_version_id
        where o.id = ov.offer_id),
      auth.uid()
    )
  );

-- Templates
drop policy if exists "Templates service role" on public.templates;
create policy "Templates service role" on public.templates
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Templates select members" on public.templates;
create policy "Templates select members" on public.templates
  for select
  using (public.is_member(organization_id, auth.uid()));

drop policy if exists "Templates write members" on public.templates;
create policy "Templates write members" on public.templates
  for all
  using (public.is_member(organization_id, auth.uid()))
  with check (public.is_member(organization_id, auth.uid()));

-- Template assets
drop policy if exists "Template assets service role" on public.template_assets;
create policy "Template assets service role" on public.template_assets
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Template assets members" on public.template_assets;
create policy "Template assets members" on public.template_assets
  for all
  using (
    public.is_member(
      (select t.organization_id from templates t where t.id = template_assets.template_id),
      auth.uid()
    )
  )
  with check (
    public.is_member(
      (select t.organization_id from templates t where t.id = template_assets.template_id),
      auth.uid()
    )
  );

-- Notes
drop policy if exists "Notes service role" on public.notes;
create policy "Notes service role" on public.notes
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Notes members" on public.notes;
create policy "Notes members" on public.notes
  for all
  using (public.is_member(organization_id, auth.uid()))
  with check (public.is_member(organization_id, auth.uid()));

-- Tasks
drop policy if exists "Tasks service role" on public.tasks;
create policy "Tasks service role" on public.tasks
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Tasks members" on public.tasks;
create policy "Tasks members" on public.tasks
  for all
  using (public.is_member(organization_id, auth.uid()))
  with check (public.is_member(organization_id, auth.uid()));

-- Activity log
drop policy if exists "Activity log service role" on public.activity_log;
create policy "Activity log service role" on public.activity_log
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Activity log members" on public.activity_log;
create policy "Activity log members" on public.activity_log
  for select
  using (public.is_member(organization_id, auth.uid()));

create policy "Activity log insert members" on public.activity_log
  for insert
  with check (public.is_member(organization_id, auth.uid()));

create policy "Activity log delete admins" on public.activity_log
  for delete
  using (public.has_org_role(organization_id, auth.uid(), array['owner','admin']::text[]));

