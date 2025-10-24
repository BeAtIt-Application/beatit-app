import { useCallback, useEffect, useState } from 'react';
import { FYPResponse, userApi } from '../api/userApi';

interface UseFYPResult {
  fypData: FYPResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useFYP = (): UseFYPResult => {
  const [fypData, setFypData] = useState<FYPResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFYPData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await userApi.getFYPData();
      setFypData(data);
      
      // Console log the response for debugging      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch FYP data';
      setError(errorMessage);
      console.error('Error fetching FYP data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchFYPData();
  }, [fetchFYPData]);

  useEffect(() => {
    fetchFYPData();
  }, [fetchFYPData]);

  return {
    fypData,
    loading,
    error,
    refetch,
  };
};
