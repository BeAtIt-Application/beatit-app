import React, { useCallback, useState } from "react";
import { Event, eventApi, EventFilterParams, EventToggleStatusResponse } from "../api/eventApi";

// Hook for fetching events with filters
export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const fetchEvents = useCallback(async (filters: EventFilterParams = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await eventApi.getPublicEvents({
        ...filters,
        page: filters.page || 1,
        limit: filters.limit || 20,
      });
      
      setEvents(response.data || []);
      setTotal(response.total || 0);
      setPage(response.page || 1);
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch events";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMoreEvents = useCallback(async (filters: EventFilterParams = {}) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const nextPage = page + 1;
      const response = await eventApi.getPublicEvents({
        ...filters,
        page: nextPage,
        limit: filters.limit || 20,
      });
      
      setEvents(prev => [...prev, ...(response.data || [])]);
      setTotal(response.total || 0);
      setPage(nextPage);
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load more events";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loading, page]);

  const refreshEvents = useCallback(async (filters: EventFilterParams = {}) => {
    setPage(1);
    return fetchEvents({ ...filters, page: 1 });
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    total,
    page,
    fetchEvents,
    loadMoreEvents,
    refreshEvents,
  };
};

// Hook for fetching a single event
export const useEvent = (id: number | null) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = useCallback(async (eventId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await eventApi.getPublicEventById(eventId);
      setEvent(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch event";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch when id changes
  React.useEffect(() => {
    if (id) {
      fetchEvent(id);
    }
  }, [id, fetchEvent]);

  return {
    event,
    loading,
    error,
    fetchEvent,
  };
};

// Hook for events near user location
export const useEventsNearUser = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEventsNearUser = useCallback(async (lat: number, lng: number, radius: number = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await eventApi.getEventsNearUser(lat, lng, radius);
      setEvents(response.data || []);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch nearby events";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    events,
    loading,
    error,
    fetchEventsNearUser,
  };
};

// Hook for toggling event status (interested/going)
export const useToggleEventStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleStatus = useCallback(async (eventId: number, status: 'interested' | 'going'): Promise<EventToggleStatusResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await eventApi.toggleEventStatus(eventId, status);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update event status";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    toggleStatus,
  };
};
