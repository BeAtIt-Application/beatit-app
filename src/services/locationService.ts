import * as Location from 'expo-location';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface LocationPermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
}

/**
 * Request location permission from the user
 */
export const requestLocationPermission = async (): Promise<LocationPermissionStatus> => {
  try {
    const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
    
    return {
      granted: status === 'granted',
      canAskAgain,
    };
  } catch (error) {
    return {
      granted: false,
      canAskAgain: false,
    };
  }
};

/**
 * Get the user's current location
 */
export const getCurrentLocation = async (): Promise<LocationCoordinates | null> => {
  try {
    // Check if permission is granted
    const { status } = await Location.getForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      console.log('Location permission not granted');
      return null;
    }

    // Get current position
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 5000,
      distanceInterval: 10,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error: any) {
    // Handle different error types
    if (error.code === 'E_LOCATION_SETTINGS_UNSATISFIED') {
      console.log('Location services are disabled');
    } else if (error.code === 'E_LOCATION_UNAVAILABLE') {
      console.log('Location is temporarily unavailable');
    } else {
      console.log('Error getting current location:', error.message || error);
    }
    return null;
  }
};

/**
 * Calculate distance between two coordinates in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

/**
 * Format distance for display
 */
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance}km`;
};

/**
 * Check if location services are enabled
 */
export const isLocationEnabled = async (): Promise<boolean> => {
  try {
    const enabled = await Location.hasServicesEnabledAsync();
    return enabled;
  } catch (error) {
    console.error('Error checking location services:', error);
    return false;
  }
};

/**
 * Get location permission status
 */
export const getLocationPermissionStatus = async (): Promise<LocationPermissionStatus> => {
  try {
    const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();
    
    return {
      granted: status === 'granted',
      canAskAgain,
    };
  } catch (error) {
    console.error('Error getting location permission status:', error);
    return {
      granted: false,
      canAskAgain: false,
    };
  }
};

/**
 * Watch user's location changes
 */
export const watchLocation = (
  callback: (location: LocationCoordinates) => void,
  errorCallback?: (error: any) => void
) => {
  return Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 10000, // Update every 10 seconds
      distanceInterval: 100, // Update every 100 meters
    },
    (location) => {
      callback({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    },
    (error) => {
      console.error('Location watch error:', error);
      if (errorCallback) {
        errorCallback(error);
      }
    }
  );
};
