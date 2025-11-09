-- RLS and helper functions for multi-tenant SaaS skeleton

create or replace function public.is_member(target_org_id uuid, target_user_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.memberships m
    join public.profiles p on p.id = m.profile_id
    where m.organization_id = target_org_id
      and p.user_id = target_user_id
      and m.status = 'active'
  );
$$;

create or replace function public.has_org_role(
  target_org_id uuid,
  target_user_id uuid,
  allowed_roles text[]
)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.memberships m
    join public.profiles p on p.id = m.profile_id
    where m.organization_id = target_org_id
      and p.user_id = target_user_id
      and m.status = 'active'
      and m.role = any(allowed_roles)
  );
$$;

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

drop policy if exists "Organizations are tenant scoped" on public.organizations;
create policy "Organizations are tenant scoped"
  on public.organizations
  for select
  using (
    auth.role() = 'service_role'
    or public.is_member(id, auth.uid())
  );

drop policy if exists "Organizations owners manage org" on public.organizations;
create policy "Organizations owners manage org"
  on public.organizations
  for update
  using (
    auth.role() = 'service_role'
    or public.has_org_role(id, auth.uid(), array['owner','admin'])
  )
  with check (
    auth.role() = 'service_role'
    or public.has_org_role(id, auth.uid(), array['owner','admin'])
  );

drop policy if exists "Organizations delete restricted" on public.organizations;
create policy "Organizations delete restricted"
  on public.organizations
  for delete
  using (
    auth.role() = 'service_role'
    or public.has_org_role(id, auth.uid(), array['owner'])
  );

drop policy if exists "Profiles are self managed" on public.profiles;
create policy "Profiles are self managed"
  on public.profiles
  for select
  using (
    auth.role() = 'service_role'
    or user_id = auth.uid()
  );

drop policy if exists "Profiles insert self" on public.profiles;
create policy "Profiles insert self"
  on public.profiles
  for insert
  with check (
    auth.role() = 'service_role'
    or user_id = auth.uid()
  );

drop policy if exists "Profiles update self" on public.profiles;
create policy "Profiles update self"
  on public.profiles
  for update
  using (
    auth.role() = 'service_role'
    or user_id = auth.uid()
  )
  with check (
    auth.role() = 'service_role'
    or user_id = auth.uid()
  );

drop policy if exists "Profiles delete self" on public.profiles;
create policy "Profiles delete self"
  on public.profiles
  for delete
  using (
    auth.role() = 'service_role'
    or user_id = auth.uid()
  );

drop policy if exists "Memberships viewable by org members" on public.memberships;
create policy "Memberships viewable by org members"
  on public.memberships
  for select
  using (
    auth.role() = 'service_role'
    or public.is_member(organization_id, auth.uid())
    or profile_id in (
      select p.id from public.profiles p where p.user_id = auth.uid()
    )
  );

drop policy if exists "Memberships manageable by admins" on public.memberships;
create policy "Memberships manageable by admins"
  on public.memberships
  for all
  using (
    auth.role() = 'service_role'
    or public.has_org_role(organization_id, auth.uid(), array['owner','admin'])
  )
  with check (
    auth.role() = 'service_role'
    or public.has_org_role(organization_id, auth.uid(), array['owner','admin'])
  );

drop policy if exists "Clients tenant scoped" on public.clients;
create policy "Clients tenant scoped"
  on public.clients
  for select
  using (
    auth.role() = 'service_role'
    or public.is_member(organization_id, auth.uid())
  );

drop policy if exists "Clients modifications tenant scoped" on public.clients;
create policy "Clients modifications tenant scoped"
  on public.clients
  for insert
  with check (
    auth.role() = 'service_role'
    or public.is_member(organization_id, auth.uid())
  );

create policy "Clients update tenant scoped"
  on public.clients
  for update
  using (
    auth.role() = 'service_role'
    or public.is_member(organization_id, auth.uid())
  )
  with check (
    auth.role() = 'service_role'
    or public.is_member(organization_id, auth.uid())
  );

create policy "Clients delete tenant scoped"
  on public.clients
  for delete
  using (
    auth.role() = 'service_role'
    or public.is_member(organization_id, auth.uid())
  );

drop policy if exists "Offers tenant scoped" on public.offers;
create policy "Offers tenant scoped"
  on public.offers
  for select
  using (
    auth.role() = 'service_role'
    or public.is_member(organization_id, auth.uid())
  );

create policy "Offers insert tenant scoped"
  on public.offers
  for insert
  with check (
    auth.role() = 'service_role'
    or public.is_member(organization_id, auth.uid())
  );

create policy "Offers update tenant scoped"
  on public.offers
  for update
  using (
    auth.role() = 'service_role'
    or public.is_member(organization_id, auth.uid())
  )
  with check (
    auth.role() = 'service_role'
    or public.is_member(organization_id, auth.uid())
  );

create policy "Offers delete tenant scoped"
  on public.offers
  for delete
  using (
    auth.role() = 'service_role'
    or public.is_member(organization_id, auth.uid())
  );

drop policy if exists "Offer versions tenant scoped" on public.offer_versions;
create policy "Offer versions tenant scoped"
  on public.offer_versions
  for select
  using (
    auth.role() = 'service_role'
    or exists (
      select 1
      from public.offers o
      where o.id = offer_versions.offer_id
        and public.is_member(o.organization_id, auth.uid())
    )
  );

create policy "Offer versions insert tenant scoped"
  on public.offer_versions
  for insert
  with check (
    auth.role() = 'service_role'
    or exists (
      select 1
      from public.offers o
      where o.id = offer_versions.offer_id
        and public.is_member(o.organization_id, auth.uid())
    )
  );

create policy "Offer versions update tenant scoped"
  on public.offer_versions
  for update
  using (
    auth.role() = 'service_role'
    or exists (
      select 1
      from public.offers o
      where o.id = offer_versions.offer_id
        and public.is_member(o.organization_id, auth.uid())
    )
  )
  with check (
    auth.role() = 'service_role'
    or exists (
      select 1
      from public.offers o
      where o.id = offer_versions.offer_id
        and public.is_member(o.organization_id, auth.uid())
    )
  );

create policy "Offer versions delete tenant scoped"
  on public.offer_versions
  for delete
  using (
    auth.role() = 'service_role'
    or exists (
      select 1
      from public.offers o
      where o.id = offer_versions.offer_id
        and public.is_member(o.organization_id, auth.uid())
    )
  );

drop policy if exists "Offer items tenant scoped" on public.offer_items;
create policy "Offer items tenant scoped"
  on public.offer_items
  for select
  using (
    auth.role() = 'service_role'
    or exists (
      select 1
      from public.offer_versions ov
      join public.offers o on o.id = ov.offer_id
      where ov.id = offer_items.offer_version_id
        and public.is_member(o.organization_id, auth.uid())
    )
  );

create policy "Offer items insert tenant scoped"
  on public.offer_items
  for insert
  with check (
    auth.role() = 'service_role'
    or exists (
      select 1
      from public.offer_versions ov
      join public.offers o on o.id = ov.offer_id
      where ov.id = offer_items.offer_version_id
        and public.is_member(o.organization_id, auth.uid())
    )
  );

create policy "Offer items update tenant scoped"
  on public.offer_items
  for update
  using (
    auth.role() = 'service_role'
    or exists (
      select 1
      from public.offer_versions ov
      join public.offers o on o.id = ov.offer_id
      where ov.id = offer_items.offer_version_id
        and public.is_member(o.organization_id, auth.uid())
    )
  )
  with check (
    auth.role() = 'service_role'
    or exists (
      select 1
      from public.offer_versions ov
      join public.offers o on o.id = ov.offer_id
      where ov.id = offer_items.offer_version_id
        and public.is_member(o.organization_id, auth.uid())
    )
  );

create policy "Offer items delete tenant scoped"
  on public.offer_items
  for delete
  using (
    auth.role() = 'service_role'
    or exists (
      select 1
      from public.offer_versions ov
      join public.offers o on o.id = ov.offer_id
      where ov.id = offer_items.offer_version_id
        and public.is_member(o.organization_id, auth.uid())
    )
  );

drop policy if exists "Templates tenant scoped" on public.templates;
create policy "Templates tenant scoped"
  on public.templates
  for select
  using (
    auth.role() = 'service_role'
    or public.is_member(organization_id, auth.uid())
  );

create policy "Templates insert tenant scoped"
  on public.templates
  for insert
  with check (
    auth.role() = 'service_role'
    or public.is_member(organization_id, auth.uid())
  );

create policy "Templates update tenant scoped"
  on public.templates
  for update
  using (
    auth.role() = 'service_role'
    or public.is_member(organization_id, auth.uid())
  )
  with check (
    auth.role() = 'service_role'
    or public.is_member(organization_id, auth.uid())
  );

create policy "Templates delete tenant scoped"
  on public.templates
  for delete
  using (
    auth.role() = 'service_role'
    or public.is_member(organization_id, auth.uid())
  );

drop policy if exists "Template assets tenant scoped" on public.template_assets;
create policy "Template assets tenant scoped"
  on public.template_assets
  for select
  using (
    auth.role() = 'service_role'
    or exists (
      select 1
      from public.templates t
      where t.id = template_assets.template_id
        and public.is_member(t.organization_id, auth.uid())
    )
  );

create policy "Template assets insert tenant scoped"
  on public.template_assets
  for insert
  with check (
    auth.role() = 'service_role'
    or exists (
      select 1
      from public.templates t
      where t.id = template_assets.template_id
        and public.is_member(t.organization_id, auth.uid())
    )
  );

create policy "Template assets update tenant scoped"
  on public.template_assets
  for update
  using (
    auth.role() = 'service_role'
    or exists (
      select 1
      from public.templates t
      where t.id = template_assets.template_id
        and public.is_member(t.organization_id, auth.uid())
    )
  )
  with check (
    auth.role() = 'service_role'
    or exists (
      select 1
      from public.templates t
      where t.id = template_assets.template_id
        and public.is_member(t.organization_id, auth.uid())
    )
  );

create policy "Template assets delete tenant scoped"
  on public.template_assets
  for delete
  using (
    auth.role() = 'service_role'
    or exists (
      select 1
      from public.templates t
      where t.id = template_assets.template_id
        and public.is_member(t.organization_id, auth.uid())
    )
  );

drop policy if exists "Notes tenant scoped" on public.notes;
create policy "Notes tenant scoped"
  on public.notes
  for select
  using (
    auth.role() = 'service_role'
    or public.is_member(organization_id, auth.uid())
  );

create policy "Notes insert tenant scoped"
  on public.notes
  for insert
  with check (
    auth.role() = 'service_role'
    or public.is_member(organization_id, auth.uid())
  );

create policy "Notes update tenant scoped"
  on public.notes
  for update
  using (
    auth.role() = 'service_role'
    or public.is_member(organization_id, auth.uid())
  )
  with check (
    auth.role() = 'service_role'
    or public.is_member(organization_id, auth.uid())
  );

create policy "Notes delete tenant scoped"
  on public.notes
  for delete
  using (
    auth.role() = 'service_role'
    or public.is_member(organization_id, auth.uid())
  );

drop policy if exists "Tasks tenant scoped" on public.tasks;
create policy "Tasks tenant scoped"
  on public.tasks
  for select
  using (
    auth.role() = 'service_role'
    or public.is_member(organization_id, auth.uid())
  );

create policy "Tasks insert tenant scoped"
  on public.tasks
  for insert
  with check (
    auth.role() = 'service_role'
    or public.is_member(organization_id, auth.uid())
  );

create policy "Tasks update tenant scoped"
  on public.tasks
  for update
  using (
    auth.role() = 'service_role'
    or public.is_member(organization_id, auth.uid())
  )
  with check (
    auth.role() = 'service_role'
    or public.is_member(organization_id, auth.uid())
  );

create policy "Tasks delete tenant scoped"
  on public.tasks
  for delete
  using (
    auth.role() = 'service_role'
    or public.is_member(organization_id, auth.uid())
  );

drop policy if exists "Activity log tenant scoped" on public.activity_log;
create policy "Activity log tenant scoped"
  on public.activity_log
  for select
  using (
    auth.role() = 'service_role'
    or public.is_member(organization_id, auth.uid())
  );

create policy "Activity log insert tenant scoped"
  on public.activity_log
  for insert
  with check (
    auth.role() = 'service_role'
    or public.is_member(organization_id, auth.uid())
  );
