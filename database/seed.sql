-- ============================================================
-- Sample Data – Contracts Management System
-- Run AFTER schema.sql
-- ============================================================

-- Clear existing data (safe for re-runs in dev)
TRUNCATE workflow_history, contracts RESTART IDENTITY CASCADE;

-- ── Contracts ────────────────────────────────────────────────
INSERT INTO contracts (id, title, description, status, owner_name, created_at, updated_at) VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001',
   'Vendor Supply Agreement – Acme Corp',
   'Annual supply contract for raw materials with Acme Corp.',
   'APPROVED', 'Alice Johnson',
   NOW() - INTERVAL '90 days', NOW() - INTERVAL '10 days'),

  ('a1b2c3d4-0002-0002-0002-000000000002',
   'Software Licensing Agreement – TechSoft',
   'Enterprise license for TechSoft suite covering 500 seats.',
   'REVIEW', 'Bob Martinez',
   NOW() - INTERVAL '30 days', NOW() - INTERVAL '2 days'),

  ('a1b2c3d4-0003-0003-0003-000000000003',
   'Office Lease – Downtown HQ',
   'Five-year lease for the downtown headquarters building.',
   'DRAFT', 'Carol Singh',
   NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),

  ('a1b2c3d4-0004-0004-0004-000000000004',
   'Consulting Services – DataInsights Ltd',
   'Six-month data analytics consulting engagement.',
   'REJECTED', 'David Lee',
   NOW() - INTERVAL '60 days', NOW() - INTERVAL '45 days'),

  ('a1b2c3d4-0005-0005-0005-000000000005',
   'Marketing Partnership – BrandBoost',
   'Co-marketing agreement with BrandBoost for Q3 campaign.',
   'EXPIRED', 'Eve Patel',
   NOW() - INTERVAL '365 days', NOW() - INTERVAL '180 days'),

  ('a1b2c3d4-0006-0006-0006-000000000006',
   'Cloud Infrastructure – NimbusTech',
   'Managed cloud hosting contract with SLA guarantees.',
   'APPROVED', 'Frank Nguyen',
   NOW() - INTERVAL '120 days', NOW() - INTERVAL '5 days'),

  ('a1b2c3d4-0007-0007-0007-000000000007',
   'HR Outsourcing – PeopleFirst',
   'Payroll and HR management outsourcing agreement.',
   'REVIEW', 'Grace Kim',
   NOW() - INTERVAL '14 days', NOW() - INTERVAL '1 day'),

  ('a1b2c3d4-0008-0008-0008-000000000008',
   'Security Audit – ShieldSec',
   'Annual penetration testing and security audit contract.',
   'DRAFT', 'Henry Brown',
   NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

  ('a1b2c3d4-0009-0009-0009-000000000009',
   'Logistics Partner – FastShip Inc',
   'Logistics and last-mile delivery services agreement.',
   'APPROVED', 'Isla White',
   NOW() - INTERVAL '200 days', NOW() - INTERVAL '30 days'),

  ('a1b2c3d4-0010-0010-0010-000000000010',
   'R&D Collaboration – InnovateLab',
   'Joint research and development agreement for AI tooling.',
   'REVIEW', 'Jack Wilson',
   NOW() - INTERVAL '20 days', NOW() - INTERVAL '2 days');

-- ── Workflow History ─────────────────────────────────────────
INSERT INTO workflow_history (contract_id, previous_status, new_status, changed_by, changed_at) VALUES
  -- Contract 1 (APPROVED)
  ('a1b2c3d4-0001-0001-0001-000000000001', NULL,       'DRAFT',    'Alice Johnson', NOW() - INTERVAL '90 days'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 'DRAFT',    'REVIEW',   'Alice Johnson', NOW() - INTERVAL '80 days'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 'REVIEW',   'APPROVED', 'Admin User',    NOW() - INTERVAL '10 days'),

  -- Contract 2 (REVIEW)
  ('a1b2c3d4-0002-0002-0002-000000000002', NULL,       'DRAFT',    'Bob Martinez',  NOW() - INTERVAL '30 days'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 'DRAFT',    'REVIEW',   'Bob Martinez',  NOW() - INTERVAL '2 days'),

  -- Contract 3 (DRAFT – no history yet beyond creation)
  ('a1b2c3d4-0003-0003-0003-000000000003', NULL,       'DRAFT',    'Carol Singh',   NOW() - INTERVAL '7 days'),

  -- Contract 4 (REJECTED)
  ('a1b2c3d4-0004-0004-0004-000000000004', NULL,       'DRAFT',    'David Lee',     NOW() - INTERVAL '60 days'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 'DRAFT',    'REVIEW',   'David Lee',     NOW() - INTERVAL '55 days'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 'REVIEW',   'REJECTED', 'Admin User',    NOW() - INTERVAL '45 days'),

  -- Contract 5 (EXPIRED)
  ('a1b2c3d4-0005-0005-0005-000000000005', NULL,       'DRAFT',    'Eve Patel',     NOW() - INTERVAL '365 days'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 'DRAFT',    'REVIEW',   'Eve Patel',     NOW() - INTERVAL '350 days'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 'REVIEW',   'APPROVED', 'Admin User',    NOW() - INTERVAL '340 days'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 'APPROVED', 'EXPIRED',  'System',        NOW() - INTERVAL '180 days'),

  -- Contract 6 (APPROVED)
  ('a1b2c3d4-0006-0006-0006-000000000006', NULL,       'DRAFT',    'Frank Nguyen',  NOW() - INTERVAL '120 days'),
  ('a1b2c3d4-0006-0006-0006-000000000006', 'DRAFT',    'REVIEW',   'Frank Nguyen',  NOW() - INTERVAL '100 days'),
  ('a1b2c3d4-0006-0006-0006-000000000006', 'REVIEW',   'APPROVED', 'Admin User',    NOW() - INTERVAL '5 days'),

  -- Contract 7 (REVIEW)
  ('a1b2c3d4-0007-0007-0007-000000000007', NULL,       'DRAFT',    'Grace Kim',     NOW() - INTERVAL '14 days'),
  ('a1b2c3d4-0007-0007-0007-000000000007', 'DRAFT',    'REVIEW',   'Grace Kim',     NOW() - INTERVAL '1 day'),

  -- Contract 8 (DRAFT)
  ('a1b2c3d4-0008-0008-0008-000000000008', NULL,       'DRAFT',    'Henry Brown',   NOW() - INTERVAL '3 days'),

  -- Contract 9 (APPROVED)
  ('a1b2c3d4-0009-0009-0009-000000000009', NULL,       'DRAFT',    'Isla White',    NOW() - INTERVAL '200 days'),
  ('a1b2c3d4-0009-0009-0009-000000000009', 'DRAFT',    'REVIEW',   'Isla White',    NOW() - INTERVAL '190 days'),
  ('a1b2c3d4-0009-0009-0009-000000000009', 'REVIEW',   'APPROVED', 'Admin User',    NOW() - INTERVAL '30 days'),

  -- Contract 10 (REVIEW)
  ('a1b2c3d4-0010-0010-0010-000000000010', NULL,       'DRAFT',    'Jack Wilson',   NOW() - INTERVAL '20 days'),
  ('a1b2c3d4-0010-0010-0010-000000000010', 'DRAFT',    'REVIEW',   'Jack Wilson',   NOW() - INTERVAL '2 days');
