import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { venueApi } from '../api/venueApi';

interface FavoritesContextType {
  favoriteVenues: Set<number>;
  toggleVenueFavorite: (venueId: number) => Promise<boolean>;
  isVenueFavorite: (venueId: number) => boolean;
  setInitialFavorites: (venueIds: number[]) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favoriteVenues, setFavoriteVenues] = useState<Set<number>>(new Set());

  const toggleVenueFavorite = useCallback(async (venueId: number): Promise<boolean> => {
    try {
      const response = await venueApi.toggleVenueFavorite(venueId);
      
      if (response.success) {
        setFavoriteVenues(prev => {
          const newSet = new Set(prev);
          if (response.is_favourite) {
            newSet.add(venueId);
          } else {
            newSet.delete(venueId);
          }
          return newSet;
        });
        return response.is_favourite;
      }
      return false;
    } catch (error) {
      console.error('Error toggling venue favorite:', error);
      throw error;
    }
  }, []);

  const isVenueFavorite = useCallback((venueId: number): boolean => {
    return favoriteVenues.has(venueId);
  }, [favoriteVenues]);

  const setInitialFavorites = useCallback((venueIds: number[]) => {
    setFavoriteVenues(new Set(venueIds));
  }, []);

  const value: FavoritesContextType = {
    favoriteVenues,
    toggleVenueFavorite,
    isVenueFavorite,
    setInitialFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
