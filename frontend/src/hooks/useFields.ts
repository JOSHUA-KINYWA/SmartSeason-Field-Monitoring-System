import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import type { FieldRecord } from '../types';

export function useFields() {
  const { session } = useAuth();
  const [fields, setFields] = useState<FieldRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFields = useCallback(async () => {
    if (!session) {
      setFields([]);
      return undefined;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<FieldRecord[]>('fields', session.access_token);
      setFields(data);
      return data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to load fields');
      return undefined;
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  return { fields, loading, error, setFields, refetch: fetchFields };
}
