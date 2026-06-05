import type { Contract, ContractFilters, PaginatedResponse, WorkflowHistory } from '../types';

const BASE_URL = '/api';

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === '1';

async function request<T>(path: string): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${path}`);
    if (!res.ok) {
      let message = `Request failed with status ${res.status}`;
      try {
        const body = await res.json();
        message = body.message || body.error || message;
      } catch {
        // ignore parse errors
      }
      throw { message, status: res.status };
    }
    return res.json() as Promise<T>;
  } catch (err) {
    // If mocks are enabled, return sensible defaults so the UI can render
    if (USE_MOCKS) {
      // Basic path-based mock handling
      if (path.startsWith('/contracts')) {
        // list
        if (path === '/contracts' || path.startsWith('/contracts?')) {
          const empty = { items: [], total: 0, page: 0, size: 10 } as unknown as T;
          return empty;
        }

        // specific contract or history
        const parts = path.split('/').filter(Boolean);
        const id = parts[1];
        if (parts.length >= 2 && parts[2] === 'history') {
          return ([]) as unknown as T;
        }

        // return a minimal contract shape for get
        const mockContract = { id: id || 'mock', title: 'Mock Contract', status: 'DRAFT' } as unknown as T;
        return mockContract;
      }

      // fallback empty
      return (null as unknown) as T;
    }

    throw err;
  }
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  return qs ? `?${qs}` : '';
}

export const contractsApi = {
  list(filters: ContractFilters = {}): Promise<PaginatedResponse<Contract>> {
    const { search, status, page = 0, size = 10 } = filters;
    const query = buildQuery({ search, status, page, size });
    return request<PaginatedResponse<Contract>>(`/contracts${query}`);
  },

  get(id: string): Promise<Contract> {
    return request<Contract>(`/contracts/${id}`);
  },

  getHistory(id: string): Promise<WorkflowHistory[]> {
    return request<WorkflowHistory[]>(`/contracts/${id}/history`);
  },
};
