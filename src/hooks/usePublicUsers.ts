import { useCallback, useEffect, useState } from 'react';
import { Artist, Organization, PublicUser, userApi, UserFilterParams } from '../api/userApi';

interface UseArtistsResult {
  artists: Artist[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  lastPage: number;
  hasMoreData: boolean;
  fetchArtists: (filters?: UserFilterParams) => Promise<void>;
  loadMoreArtists: (filters?: UserFilterParams) => Promise<void>;
  refreshArtists: (filters?: UserFilterParams) => Promise<void>;
}

export const useArtists = (initialFilters?: UserFilterParams): UseArtistsResult => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [filters, setFilters] = useState<UserFilterParams>(initialFilters || {});

  const fetchArtists = useCallback(async (newFilters?: UserFilterParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const filtersToUse = newFilters || filters;
      setFilters(filtersToUse);
      
      const response = await userApi.getPublicArtists({
        ...filtersToUse,
        page: filtersToUse.page || 1,
        limit: filtersToUse.limit || 20,
      });
      
      setArtists(response.data || []);
      setTotal(response.pagination?.total || 0);
      setPage(response.pagination?.currentPage || 1);
      setLastPage(response.pagination?.lastPage || 1);
      setHasMoreData((response.pagination?.currentPage || 1) < (response.pagination?.lastPage || 1));
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch artists';
      setError(errorMessage);
      console.error('Error fetching artists:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadMoreArtists = useCallback(async (newFilters?: UserFilterParams) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const filtersToUse = newFilters || filters;
      const nextPage = page + 1;
      
      const response = await userApi.getPublicArtists({
        ...filtersToUse,
        page: nextPage,
        limit: filtersToUse.limit || 20,
      });
      
      setArtists(prev => [...prev, ...(response.data || [])]);
      setTotal(response.pagination?.total || 0);
      setPage(nextPage);
      setLastPage(response.pagination?.lastPage || 1);
      setHasMoreData(nextPage < (response.pagination?.lastPage || 1));
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load more artists';
      setError(errorMessage);
      console.error('Error loading more artists:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loading, page, filters]);

  const refreshArtists = useCallback(async (newFilters?: UserFilterParams) => {
    setPage(1);
    setHasMoreData(true);
    await fetchArtists({ ...newFilters, page: 1 });
  }, [fetchArtists]);

  useEffect(() => {
    fetchArtists(initialFilters);
  }, []); // Only fetch on mount

  return {
    artists,
    loading,
    error,
    total,
    page,
    lastPage,
    hasMoreData,
    fetchArtists,
    loadMoreArtists,
    refreshArtists,
  };
};

interface UseOrganizationsResult {
  organizations: Organization[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  lastPage: number;
  hasMoreData: boolean;
  fetchOrganizations: (filters?: UserFilterParams) => Promise<void>;
  loadMoreOrganizations: (filters?: UserFilterParams) => Promise<void>;
  refreshOrganizations: (filters?: UserFilterParams) => Promise<void>;
}

export const useOrganizations = (initialFilters?: UserFilterParams): UseOrganizationsResult => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [filters, setFilters] = useState<UserFilterParams>(initialFilters || {});

  const fetchOrganizations = useCallback(async (newFilters?: UserFilterParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const filtersToUse = newFilters || filters;
      setFilters(filtersToUse);
      
      const response = await userApi.getPublicOrganizations({
        ...filtersToUse,
        page: filtersToUse.page || 1,
        limit: filtersToUse.limit || 20,
      });
      
      setOrganizations(response.data || []);
      setTotal(response.pagination?.total || 0);
      setPage(response.pagination?.currentPage || 1);
      setLastPage(response.pagination?.lastPage || 1);
      setHasMoreData((response.pagination?.currentPage || 1) < (response.pagination?.lastPage || 1));
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch organizations';
      setError(errorMessage);
      console.error('Error fetching organizations:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadMoreOrganizations = useCallback(async (newFilters?: UserFilterParams) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const filtersToUse = newFilters || filters;
      const nextPage = page + 1;
      
      const response = await userApi.getPublicOrganizations({
        ...filtersToUse,
        page: nextPage,
        limit: filtersToUse.limit || 20,
      });
      
      setOrganizations(prev => [...prev, ...(response.data || [])]);
      setTotal(response.pagination?.total || 0);
      setPage(nextPage);
      setLastPage(response.pagination?.lastPage || 1);
      setHasMoreData(nextPage < (response.pagination?.lastPage || 1));
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load more organizations';
      setError(errorMessage);
      console.error('Error loading more organizations:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loading, page, filters]);

  const refreshOrganizations = useCallback(async (newFilters?: UserFilterParams) => {
    setPage(1);
    setHasMoreData(true);
    await fetchOrganizations({ ...newFilters, page: 1 });
  }, [fetchOrganizations]);

  useEffect(() => {
    fetchOrganizations(initialFilters);
  }, []); // Only fetch on mount

  return {
    organizations,
    loading,
    error,
    total,
    page,
    lastPage,
    hasMoreData,
    fetchOrganizations,
    loadMoreOrganizations,
    refreshOrganizations,
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

// Combined hook for both artists and organizations
interface UseUsersResult {
  users: PublicUser[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  lastPage: number;
  hasMoreData: boolean;
  fetchUsers: (filters?: UserFilterParams) => Promise<void>;
  loadMoreUsers: (filters?: UserFilterParams) => Promise<void>;
  refreshUsers: (filters?: UserFilterParams) => Promise<void>;
}

export const useUsers = (userType: 'artists' | 'organizations', initialFilters?: UserFilterParams): UseUsersResult => {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [filters, setFilters] = useState<UserFilterParams>(initialFilters || {});

  const fetchUsers = useCallback(async (newFilters?: UserFilterParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const filtersToUse = newFilters || filters;
      setFilters(filtersToUse);
      
      const response = userType === 'organizations' 
        ? await userApi.getPublicOrganizations({
            ...filtersToUse,
            page: filtersToUse.page || 1,
            limit: filtersToUse.limit || 20,
          })
        : await userApi.getPublicArtists({
            ...filtersToUse,
            page: filtersToUse.page || 1,
            limit: filtersToUse.limit || 20,
          });
      
      setUsers(response.data || []);
      setTotal(response.pagination?.total || 0);
      setPage(response.pagination?.currentPage || 1);
      setLastPage(response.pagination?.lastPage || 1);
      setHasMoreData((response.pagination?.currentPage || 1) < (response.pagination?.lastPage || 1));
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to fetch ${userType}`;
      setError(errorMessage);
      console.error(`Error fetching ${userType}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userType, filters]);

  const loadMoreUsers = useCallback(async (newFilters?: UserFilterParams) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const filtersToUse = newFilters || filters;
      const nextPage = page + 1;
      
      const response = userType === 'organizations' 
        ? await userApi.getPublicOrganizations({
            ...filtersToUse,
            page: nextPage,
            limit: filtersToUse.limit || 20,
          })
        : await userApi.getPublicArtists({
            ...filtersToUse,
            page: nextPage,
            limit: filtersToUse.limit || 20,
          });
      
      setUsers(prev => [...prev, ...(response.data || [])]);
      setTotal(response.pagination?.total || 0);
      setPage(nextPage);
      setLastPage(response.pagination?.lastPage || 1);
      setHasMoreData(nextPage < (response.pagination?.lastPage || 1));
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to load more ${userType}`;
      setError(errorMessage);
      console.error(`Error loading more ${userType}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loading, page, filters, userType]);

  const refreshUsers = useCallback(async (newFilters?: UserFilterParams) => {
    setPage(1);
    setHasMoreData(true);
    await fetchUsers({ ...newFilters, page: 1 });
  }, [fetchUsers]);

  // Auto-fetch on mount
  useEffect(() => {
    fetchUsers(initialFilters);
  }, []);

  return {
    users,
    loading,
    error,
    total,
    page,
    lastPage,
    hasMoreData,
    fetchUsers,
    loadMoreUsers,
    refreshUsers,
  };
};

