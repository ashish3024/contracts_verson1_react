import type {
  Contract,
  ContractFilters,
  PaginatedResponse,
  WorkflowHistory,
} from '../types';
import {
  getMockContracts,
  getMockContract,
  getMockHistory,
} from './mockApi';

const BASE_URL = '/api';
const useMockFallback = import.meta.env.VITE_USE_MOCKS === 'true';

function isNetworkError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const message = typeof (err as { message?: unknown }).message === 'string'
    ? String((err as { message?: unknown }).message)
    : '';

  return (
    message.includes('Failed to fetch') ||
    message.includes('NetworkError') ||
    message.includes('ECONNREFUSED') ||
    err instanceof TypeError
  );
}

async function request<T>(path: string): Promise<T> {
  if (useMockFallback) {
    return mockRequest<T>(path);
  }

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
  } catch (err: unknown) {
    if (isNetworkError(err)) {
      return mockRequest<T>(path);
    }
    throw err;
  }
}

function parseQuery(path: string) {
  const [pathname, search] = path.split('?');
  const params = new URLSearchParams(search || '');
  return { pathname, params };
}

function mockRequest<T>(path: string): T {
  const { pathname, params } = parseQuery(path);
  const segments = pathname.split('/').filter(Boolean);

  if (segments[0] !== 'contracts') {
    throw new Error('Unsupported mock endpoint');
  }

  if (segments.length === 1) {
    return getMockContracts({
      search: params.get('search') ?? undefined,
      status: (params.get('status') as any) ?? undefined,
      page: params.get('page') ? Number(params.get('page')) : undefined,
      size: params.get('size') ? Number(params.get('size')) : undefined,
    }) as unknown as T;
  }

  const id = segments[1];

  if (segments.length === 2) {
    return getMockContract(id) as unknown as T;
  }

  if (segments.length === 3 && segments[2] === 'history') {
    return getMockHistory(id) as unknown as T;
  }

  throw new Error('Unsupported mock endpoint');
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
