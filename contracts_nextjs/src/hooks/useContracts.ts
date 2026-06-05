'use client';

import { useCallback, useEffect, useState } from 'react';
import { contractsApi } from '../services/api';
import type { Contract, ContractFilters, PaginatedResponse } from '../types';

interface State {
  data: PaginatedResponse<Contract> | null;
  loading: boolean;
  error: string | null;
}

export function useContracts(filters: ContractFilters) {
  const [state, setState] = useState<State>({ data: null, loading: true, error: null });

  const fetchData = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await contractsApi.list(filters);
      setState({ data, loading: false, error: null });
    } catch (err: unknown) {
      const msg =
        typeof err === 'object' && err !== null && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Failed to load contracts.';
      setState({ data: null, loading: false, error: msg });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { ...state, refetch: fetchData };
}
