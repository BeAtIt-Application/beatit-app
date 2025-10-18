import { useCallback, useEffect, useState } from "react";
import type { Taxonomy } from "../api/taxonomyApi";
import { taxonomyApi } from "../api/taxonomyApi";

// Hook for fetching music genres
export const useMusicGenres = () => {
  const [genres, setGenres] = useState<Taxonomy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGenres = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await taxonomyApi.getMusicGenres();
      setGenres(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch music genres";
      setError(errorMessage);
      console.error("Error fetching music genres:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  return {
    genres,
    isLoading,
    error,
    refetch: fetchGenres,
  };
};

// Hook for fetching venue types
export const useVenueTypes = () => {
  const [venueTypes, setVenueTypes] = useState<Taxonomy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVenueTypes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await taxonomyApi.getVenueTypes();
      setVenueTypes(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch venue types";
      setError(errorMessage);
      console.error("Error fetching venue types:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVenueTypes();
  }, [fetchVenueTypes]);

  return {
    venueTypes,
    isLoading,
    error,
    refetch: fetchVenueTypes,
  };
};

