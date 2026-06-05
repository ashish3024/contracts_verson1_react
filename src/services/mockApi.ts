import type { Contract, ContractFilters, PaginatedResponse, WorkflowHistory } from '../types';

const mockContracts: Contract[] = [
  {
    id: 'C-001',
    title: 'Supplier Agreement for Office Supplies',
    description: 'Annual procurement agreement for office supplies across all branches.',
    status: 'APPROVED',
    owner_name: 'Aarti Singh',
    created_at: '2025-12-01T09:15:00Z',
    updated_at: '2026-01-12T14:20:00Z',
  },
  {
    id: 'C-002',
    title: 'Cloud Services Partnership',
    description: 'Agreement with cloud provider for infrastructure and support services.',
    status: 'REVIEW',
    owner_name: 'Rohit Sharma',
    created_at: '2026-01-10T11:00:00Z',
    updated_at: '2026-02-03T08:50:00Z',
  },
  {
    id: 'C-003',
    title: 'Marketing Campaign Contract',
    description: 'Campaign services contract with external marketing agency.',
    status: 'DRAFT',
    owner_name: 'Priya Patel',
    created_at: '2026-02-14T15:45:00Z',
    updated_at: '2026-02-14T15:45:00Z',
  },
  {
    id: 'C-004',
    title: 'Office Lease Renewal',
    description: 'Renewal agreement for corporate office space through 2028.',
    status: 'APPROVED',
    owner_name: 'Arjun Mehta',
    created_at: '2025-11-20T10:30:00Z',
    updated_at: '2025-12-05T17:10:00Z',
  },
  {
    id: 'C-005',
    title: 'Annual Software Licensing',
    description: 'Enterprise license agreement for productivity and collaboration tools.',
    status: 'EXPIRED',
    owner_name: 'Simran Kaur',
    created_at: '2024-09-08T08:00:00Z',
    updated_at: '2025-09-08T08:00:00Z',
  },
  {
    id: 'C-006',
    title: 'Consulting Services Retainer',
    description: 'Consulting retainer agreement for business transformation services.',
    status: 'REJECTED',
    owner_name: 'Nikhil Verma',
    created_at: '2026-03-02T13:20:00Z',
    updated_at: '2026-03-21T09:40:00Z',
  },
  {
    id: 'C-007',
    title: 'Data Privacy Compliance Review',
    description: 'Contract for external compliance audit and privacy review support.',
    status: 'REVIEW',
    owner_name: 'Neha Joshi',
    created_at: '2026-03-25T10:10:00Z',
    updated_at: '2026-04-01T16:05:00Z',
  },
  {
    id: 'C-008',
    title: 'HR Benefits Administration',
    description: 'Benefits administration and enrollment services for employees.',
    status: 'APPROVED',
    owner_name: 'Amit Kumar',
    created_at: '2026-01-28T09:30:00Z',
    updated_at: '2026-02-12T10:55:00Z',
  },
  {
    id: 'C-009',
    title: 'IT Equipment Purchase',
    description: 'Bulk purchase agreement for new laptops and peripheral equipment.',
    status: 'DRAFT',
    owner_name: 'Shruti Rao',
    created_at: '2026-04-05T14:00:00Z',
    updated_at: '2026-04-05T14:00:00Z',
  },
  {
    id: 'C-010',
    title: 'Customer Support Outsourcing',
    description: 'Service agreement for outsourced customer support operations.',
    status: 'REVIEW',
    owner_name: 'Sachin Gupta',
    created_at: '2026-02-18T12:25:00Z',
    updated_at: '2026-03-01T11:15:00Z',
  },
  {
    id: 'C-011',
    title: 'Fleet Maintenance Agreement',
    description: 'Maintenance services for company vehicle fleet through next year.',
    status: 'APPROVED',
    owner_name: 'Meera Iyer',
    created_at: '2025-10-14T08:35:00Z',
    updated_at: '2025-11-01T12:40:00Z',
  },
  {
    id: 'C-012',
    title: 'Training and Development Program',
    description: 'Employee training contract for skill development and leadership programs.',
    status: 'DRAFT',
    owner_name: 'Vikram Nair',
    created_at: '2026-04-12T09:00:00Z',
    updated_at: '2026-04-12T09:00:00Z',
  },
];

const mockHistories: Record<string, WorkflowHistory[]> = {
  'C-001': [
    {
      id: 'H-001-1',
      contract_id: 'C-001',
      previous_status: null,
      new_status: 'DRAFT',
      changed_by: 'Aarti Singh',
      changed_at: '2025-12-01T09:15:00Z',
    },
    {
      id: 'H-001-2',
      contract_id: 'C-001',
      previous_status: 'DRAFT',
      new_status: 'APPROVED',
      changed_by: 'Nikhil Verma',
      changed_at: '2026-01-12T14:20:00Z',
    },
  ],
  'C-002': [
    {
      id: 'H-002-1',
      contract_id: 'C-002',
      previous_status: null,
      new_status: 'DRAFT',
      changed_by: 'Rohit Sharma',
      changed_at: '2026-01-10T11:00:00Z',
    },
    {
      id: 'H-002-2',
      contract_id: 'C-002',
      previous_status: 'DRAFT',
      new_status: 'REVIEW',
      changed_by: 'Priya Patel',
      changed_at: '2026-02-03T08:50:00Z',
    },
  ],
};

function filterContracts(filters: ContractFilters): Contract[] {
  const { search, status } = filters;

  return mockContracts.filter((contract) => {
    const matchesStatus = !status || contract.status === status;
    const matchesSearch = !search
      || contract.title.toLowerCase().includes(search.toLowerCase())
      || contract.owner_name.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });
}

export function getMockContracts(filters: ContractFilters): PaginatedResponse<Contract> {
  const page = filters.page ?? 0;
  const size = filters.size ?? 10;
  const filtered = filterContracts(filters);
  const start = page * size;
  const content = filtered.slice(start, start + size);

  return {
    content,
    number: page,
    size,
    totalElements: filtered.length,
    totalPages: Math.ceil(filtered.length / size),
  };
}

export function getMockContract(id: string): Contract {
  return mockContracts.find((contract) => contract.id === id) ?? mockContracts[0];
}

export function getMockHistory(id: string): WorkflowHistory[] {
  return mockHistories[id] ?? [
    {
      id: `${id}-H-1`,
      contract_id: id,
      previous_status: null,
      new_status: 'DRAFT',
      changed_by: 'System',
      changed_at: new Date().toISOString(),
    },
  ];
}
