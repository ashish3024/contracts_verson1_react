import { useEffect, useState } from 'react';
import { contractsApi } from '../services/api';
import type { Contract, WorkflowHistory } from '../types';

interface UseContractState {
  contract: Contract | null;
  history: WorkflowHistory[];
  loading: boolean;
  error: string | null;
}

export function useContract(id: string) {
  const [state, setState] = useState<UseContractState>({
    contract: null,
    history: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    setState({ contract: null, history: [], loading: true, error: null });

    Promise.all([contractsApi.get(id), contractsApi.getHistory(id)])
      .then(([contract, history]) => {
        if (!cancelled) setState({ contract, history, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const msg =
          typeof err === 'object' && err !== null && 'message' in err
            ? String((err as { message: unknown }).message)
            : 'Failed to load contract.';
        setState({ contract: null, history: [], loading: false, error: msg });
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return state;
}
