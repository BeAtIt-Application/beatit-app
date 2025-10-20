import { useEffect, useState } from 'react';
import { Artist, Organization, PublicUser, userApi, UserFilterParams, UserPagination } from '../api/userApi';

interface UseArtistsResult {
  artists: Artist[];
  loading: boolean;
  error: string | null;
  pagination: UserPagination | null;
  fetchArtists: (filters?: UserFilterParams) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useArtists = (initialFilters?: UserFilterParams): UseArtistsResult => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UserPagination | null>(null);
  const [filters, setFilters] = useState<UserFilterParams>(initialFilters || {});

  const fetchArtists = async (newFilters?: UserFilterParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const filtersToUse = newFilters || filters;
      setFilters(filtersToUse);
      
      const response = await userApi.getPublicArtists(filtersToUse);
      
      setArtists(response.data);
      setPagination(response.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch artists';
      setError(errorMessage);
      console.error('Error fetching artists:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchArtists(filters);
  };

  useEffect(() => {
    fetchArtists(initialFilters);
  }, []); // Only fetch on mount

  return {
    artists,
    loading,
    error,
    pagination,
    fetchArtists,
    refetch,
  };
};

interface UseOrganizationsResult {
  organizations: Organization[];
  loading: boolean;
  error: string | null;
  pagination: UserPagination | null;
  fetchOrganizations: (filters?: UserFilterParams) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useOrganizations = (initialFilters?: UserFilterParams): UseOrganizationsResult => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UserPagination | null>(null);
  const [filters, setFilters] = useState<UserFilterParams>(initialFilters || {});

  const fetchOrganizations = async (newFilters?: UserFilterParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const filtersToUse = newFilters || filters;
      setFilters(filtersToUse);
      
      const response = await userApi.getPublicOrganizations(filtersToUse);
      
      setOrganizations(response.data);
      setPagination(response.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch organizations';
      setError(errorMessage);
      console.error('Error fetching organizations:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchOrganizations(filters);
  };

  useEffect(() => {
    fetchOrganizations(initialFilters);
  }, []); // Only fetch on mount

  return {
    organizations,
    loading,
    error,
    pagination,
    fetchOrganizations,
    refetch,
  };
};

interface UsePublicUserResult {
  user: PublicUser | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const usePublicUser = (id: number | null): UsePublicUserResult => {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    if (!id) {
      setUser(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await userApi.getPublicUserById(id);
      setUser(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user';
      setError(errorMessage);
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  return {
    user,
    loading,
    error,
    refetch,
  };
};

