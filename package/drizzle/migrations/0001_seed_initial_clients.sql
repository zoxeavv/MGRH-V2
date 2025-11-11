-- Seed data for CardStacks CRM demo tenants.

INSERT INTO organizations (id, name, created_at)
VALUES ('11111111-1111-1111-1111-111111111111', 'CardStacks Demo Organization', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, organization_id, email, full_name, role, created_at, updated_at)
VALUES
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'owner@cardstacks.dev', 'Demo Owner', 'owner', NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'sales@cardstacks.dev', 'Sales Manager', 'member', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO clients (
  id,
  organization_id,
  owner_id,
  name,
  company,
  email,
  phone,
  status,
  tags,
  notes,
  created_at,
  updated_at
)
VALUES
  (
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'Acme Industries',
    'Acme Inc.',
    'ops@acme.com',
    '+1-415-555-0101',
    'active',
    ARRAY['enterprise','vip'],
    'Key account focused on SaaS expansion.',
    NOW(),
    NOW()
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    'Northwind Logistics',
    'Northwind Holdings',
    'hello@northwind.com',
    '+44 20 7946 0958',
    'prospect',
    ARRAY['logistics','high-touch'],
    'Awaiting proposal feedback and security questionnaire.',
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO NOTHING;
