-- Helper functions ---------------------------------------------------------
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
      and p.user_id = uid
      and m.status = 'active'
  );
$$;

create or replace function public.has_org_role(org_id uuid, uid uuid, roles org_role[])
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
      and p.user_id = uid
      and m.status = 'active'
      and m.role = any (roles)
  );
$$;

-- Enable RLS on all tables --------------------------------------------------
alter table organizations enable row level security;
alter table profiles enable row level security;
alter table memberships enable row level security;
alter table clients enable row level security;
alter table offers enable row level security;
alter table offer_versions enable row level security;
alter table offer_items enable row level security;
alter table templates enable row level security;
alter table template_assets enable row level security;
alter table notes enable row level security;
alter table tasks enable row level security;
alter table activity_log enable row level security;

-- Organizations: owners/admins manage, members read ------------------------
drop policy if exists "Organizations select" on organizations;
create policy "Organizations select" on organizations
for select
using (
  auth.role() = 'service_role'
  or exists (
    select 1
    from memberships m
    join profiles p on p.id = m.profile_id
    where m.organization_id = organizations.id
      and p.user_id = auth.uid()
      and m.status = 'active'
  )
);

drop policy if exists "Organizations modify" on organizations;
create policy "Organizations modify" on organizations
for all
using (
  auth.role() = 'service_role'
  or has_org_role(organizations.id, auth.uid(), array['owner', 'admin']::org_role[])
)
with check (
  auth.role() = 'service_role'
  or has_org_role(organizations.id, auth.uid(), array['owner', 'admin']::org_role[])
);

-- Profiles: users can manage their profile ---------------------------------
drop policy if exists "Profiles select" on profiles;
create policy "Profiles select" on profiles
for select
using (
  auth.role() = 'service_role'
  or profiles.user_id = auth.uid()
  or exists (
    select 1
    from memberships m
    where m.profile_id = profiles.id
      and m.status = 'active'
      and has_org_role(m.organization_id, auth.uid(), array['owner', 'admin']::org_role[])
  )
);

drop policy if exists "Profiles modify self" on profiles;
create policy "Profiles modify self" on profiles
for all
using (
  auth.role() = 'service_role'
  or profiles.user_id = auth.uid()
)
with check (
  auth.role() = 'service_role'
  or profiles.user_id = auth.uid()
);

-- Memberships: members can view, owner/admin manage ------------------------
drop policy if exists "Memberships select" on memberships;
create policy "Memberships select" on memberships
for select
using (
  auth.role() = 'service_role'
  or is_member(memberships.organization_id, auth.uid())
);

drop policy if exists "Memberships modify" on memberships;
create policy "Memberships modify" on memberships
for all
using (
  auth.role() = 'service_role'
  or has_org_role(memberships.organization_id, auth.uid(), array['owner', 'admin']::org_role[])
)
with check (
  auth.role() = 'service_role'
  or has_org_role(memberships.organization_id, auth.uid(), array['owner', 'admin']::org_role[])
);

-- Clients: scoped by organization ------------------------------------------
drop policy if exists "Clients select" on clients;
create policy "Clients select" on clients
for select
using (
  auth.role() = 'service_role'
  or is_member(clients.organization_id, auth.uid())
);

drop policy if exists "Clients modify" on clients;
create policy "Clients modify" on clients
for all
using (
  auth.role() = 'service_role'
  or has_org_role(clients.organization_id, auth.uid(), array['owner', 'admin', 'user']::org_role[])
)
with check (
  auth.role() = 'service_role'
  or has_org_role(clients.organization_id, auth.uid(), array['owner', 'admin', 'user']::org_role[])
);

-- Offers -------------------------------------------------------------------
drop policy if exists "Offers select" on offers;
create policy "Offers select" on offers
for select
using (
  auth.role() = 'service_role'
  or is_member(offers.organization_id, auth.uid())
);

drop policy if exists "Offers modify" on offers;
create policy "Offers modify" on offers
for all
using (
  auth.role() = 'service_role'
  or has_org_role(offers.organization_id, auth.uid(), array['owner', 'admin', 'user']::org_role[])
)
with check (
  auth.role() = 'service_role'
  or has_org_role(offers.organization_id, auth.uid(), array['owner', 'admin', 'user']::org_role[])
);

-- Offer versions -----------------------------------------------------------
drop policy if exists "Offer versions read" on offer_versions;
create policy "Offer versions read" on offer_versions
for select
using (
  auth.role() = 'service_role'
  or exists (
    select 1
    from offers o
    where o.id = offer_versions.offer_id
      and is_member(o.organization_id, auth.uid())
  )
);

drop policy if exists "Offer versions modify" on offer_versions;
create policy "Offer versions modify" on offer_versions
for all
using (
  auth.role() = 'service_role'
  or exists (
    select 1
    from offers o
    where o.id = offer_versions.offer_id
      and has_org_role(o.organization_id, auth.uid(), array['owner', 'admin', 'user']::org_role[])
  )
)
with check (
  auth.role() = 'service_role'
  or exists (
    select 1
    from offers o
    where o.id = offer_versions.offer_id
      and has_org_role(o.organization_id, auth.uid(), array['owner', 'admin', 'user']::org_role[])
  )
);

-- Offer items --------------------------------------------------------------
drop policy if exists "Offer items read" on offer_items;
create policy "Offer items read" on offer_items
for select
using (
  auth.role() = 'service_role'
  or exists (
    select 1
    from offer_versions ov
    join offers o on o.id = ov.offer_id
    where ov.id = offer_items.offer_version_id
      and is_member(o.organization_id, auth.uid())
  )
);

drop policy if exists "Offer items modify" on offer_items;
create policy "Offer items modify" on offer_items
for all
using (
  auth.role() = 'service_role'
  or exists (
    select 1
    from offer_versions ov
    join offers o on o.id = ov.offer_id
    where ov.id = offer_items.offer_version_id
      and has_org_role(o.organization_id, auth.uid(), array['owner', 'admin', 'user']::org_role[])
  )
)
with check (
  auth.role() = 'service_role'
  or exists (
    select 1
    from offer_versions ov
    join offers o on o.id = ov.offer_id
    where ov.id = offer_items.offer_version_id
      and has_org_role(o.organization_id, auth.uid(), array['owner', 'admin', 'user']::org_role[])
  )
);

-- Templates ----------------------------------------------------------------
drop policy if exists "Templates select" on templates;
create policy "Templates select" on templates
for select
using (
  auth.role() = 'service_role'
  or is_member(templates.organization_id, auth.uid())
);

drop policy if exists "Templates modify" on templates;
create policy "Templates modify" on templates
for all
using (
  auth.role() = 'service_role'
  or has_org_role(templates.organization_id, auth.uid(), array['owner', 'admin', 'user']::org_role[])
)
with check (
  auth.role() = 'service_role'
  or has_org_role(templates.organization_id, auth.uid(), array['owner', 'admin', 'user']::org_role[])
);

-- Template assets ----------------------------------------------------------
drop policy if exists "Template assets select" on template_assets;
create policy "Template assets select" on template_assets
for select
using (
  auth.role() = 'service_role'
  or exists (
    select 1
    from templates t
    where t.id = template_assets.template_id
      and is_member(t.organization_id, auth.uid())
  )
);

drop policy if exists "Template assets modify" on template_assets;
create policy "Template assets modify" on template_assets
for all
using (
  auth.role() = 'service_role'
  or exists (
    select 1
    from templates t
    where t.id = template_assets.template_id
      and has_org_role(t.organization_id, auth.uid(), array['owner', 'admin', 'user']::org_role[])
  )
)
with check (
  auth.role() = 'service_role'
  or exists (
    select 1
    from templates t
    where t.id = template_assets.template_id
      and has_org_role(t.organization_id, auth.uid(), array['owner', 'admin', 'user']::org_role[])
  )
);

-- Notes --------------------------------------------------------------------
drop policy if exists "Notes select" on notes;
create policy "Notes select" on notes
for select
using (
  auth.role() = 'service_role'
  or is_member(notes.organization_id, auth.uid())
);

drop policy if exists "Notes modify" on notes;
create policy "Notes modify" on notes
for all
using (
  auth.role() = 'service_role'
  or has_org_role(notes.organization_id, auth.uid(), array['owner', 'admin', 'user']::org_role[])
)
with check (
  auth.role() = 'service_role'
  or has_org_role(notes.organization_id, auth.uid(), array['owner', 'admin', 'user']::org_role[])
);

-- Tasks --------------------------------------------------------------------
drop policy if exists "Tasks select" on tasks;
create policy "Tasks select" on tasks
for select
using (
  auth.role() = 'service_role'
  or is_member(tasks.organization_id, auth.uid())
);

drop policy if exists "Tasks modify" on tasks;
create policy "Tasks modify" on tasks
for all
using (
  auth.role() = 'service_role'
  or has_org_role(tasks.organization_id, auth.uid(), array['owner', 'admin', 'user']::org_role[])
)
with check (
  auth.role() = 'service_role'
  or has_org_role(tasks.organization_id, auth.uid(), array['owner', 'admin', 'user']::org_role[])
);

-- Activity log -------------------------------------------------------------
drop policy if exists "Activity log select" on activity_log;
create policy "Activity log select" on activity_log
for select
using (
  auth.role() = 'service_role'
  or is_member(activity_log.organization_id, auth.uid())
);

drop policy if exists "Activity log insert" on activity_log;
create policy "Activity log insert" on activity_log
for insert
with check (
  auth.role() = 'service_role'
  or has_org_role(activity_log.organization_id, auth.uid(), array['owner', 'admin', 'user']::org_role[])
);
