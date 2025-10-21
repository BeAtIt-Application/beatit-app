import React, { useCallback, useState } from "react";
import { Venue, venueApi, VenueFilterParams } from "../api/venueApi";

// Hook for fetching venues with filters
export const useVenues = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const fetchVenues = useCallback(async (filters: VenueFilterParams = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await venueApi.getPublicVenuesFiltered({
        ...filters,
        page: filters.page || 1,
        limit: filters.limit || 20,
      });
      
      setVenues(response.data || []);
      setTotal(response.total || 0);
      setPage(response.page || 1);
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch venues";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMoreVenues = useCallback(async (filters: VenueFilterParams = {}) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const nextPage = page + 1;
      const response = await venueApi.getPublicVenuesFiltered({
        ...filters,
        page: nextPage,
        limit: filters.limit || 20,
      });
      
      setVenues(prev => [...prev, ...(response.data || [])]);
      setTotal(response.total || 0);
      setPage(nextPage);
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load more venues";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loading, page]);

  const refreshVenues = useCallback(async (filters: VenueFilterParams = {}) => {
    setPage(1);
    return fetchVenues({ ...filters, page: 1 });
  }, [fetchVenues]);

  return {
    venues,
    loading,
    error,
    total,
    page,
    fetchVenues,
    loadMoreVenues,
    refreshVenues,
  };
};

// Hook for fetching a single venue
export const useVenue = (id: number | null) => {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVenue = useCallback(async (venueId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await venueApi.getPublicVenueById(venueId);
      setVenue(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch venue";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch when id changes
  React.useEffect(() => {
    if (id) {
      fetchVenue(id);
    }
  }, [id, fetchVenue]);

  return {
    venue,
    loading,
    error,
    fetchVenue,
  };
};

// Hook for venues near user location
export const useVenuesNearUser = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVenuesNearUser = useCallback(async (lat: number, lng: number, radiusInMeters: number = 10000) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await venueApi.getVenuesNearUser(lat, lng, radiusInMeters);
      setVenues(response.data || []);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch nearby venues";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    venues,
    loading,
    error,
    fetchVenuesNearUser,
  };
};
