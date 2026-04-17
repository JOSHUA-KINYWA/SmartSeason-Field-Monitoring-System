import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import type { AgentRecord } from '../types';

export function useAgents() {
  const { session } = useAuth();
  const [agents, setAgents] = useState<AgentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = useCallback(async () => {
    if (!session) {
      setAgents([]);
      return undefined;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<AgentRecord[]>('auth/agents', session.access_token);
      setAgents(data);
      return data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to load agents');
      return undefined;
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return { agents, loading, error, refetch: fetchAgents };
}
