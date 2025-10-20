import { useEffect, useState } from 'react';
import { profileApi, UpdateInterestsRequest, UpdatePasswordRequest, UpdateProfileRequest, UserProfile } from '../api/profileApi';

interface UseProfileResult {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  updatePassword: (data: UpdatePasswordRequest) => Promise<void>;
  uploadAvatar: (file: File | Blob) => Promise<void>;
  updateInterests: (data: UpdateInterestsRequest) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useProfile = (autoFetch = true): UseProfileResult => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await profileApi.getProfile();
      setProfile(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(errorMessage);
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedProfile = await profileApi.updateProfile(data);
      setProfile(updatedProfile);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      console.error('Error updating profile:', err);
      throw err; // Re-throw to allow component to handle it
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (data: UpdatePasswordRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      await profileApi.updatePassword(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update password';
      setError(errorMessage);
      console.error('Error updating password:', err);
      throw err; // Re-throw to allow component to handle it
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file: File | Blob) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await profileApi.uploadAvatar(file);
      
      // Update profile with new avatar URLs
      if (profile) {
        setProfile({
          ...profile,
          avatar_url: response.avatar_url || profile.avatar_url,
          avatar_thumbnail: response.avatar_thumbnail || profile.avatar_thumbnail,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload avatar';
      setError(errorMessage);
      console.error('Error uploading avatar:', err);
      throw err; // Re-throw to allow component to handle it
    } finally {
      setLoading(false);
    }
  };

  const updateInterests = async (data: UpdateInterestsRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await profileApi.updateInterests(data);
      
      // Update profile with new interests
      if (profile) {
        setProfile({
          ...profile,
          preferred_music_genres: response.preferred_music_genres || profile.preferred_music_genres,
          preferred_venue_types: response.preferred_venue_types || profile.preferred_venue_types,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update interests';
      setError(errorMessage);
      console.error('Error updating interests:', err);
      throw err; // Re-throw to allow component to handle it
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchProfile();
  };

  useEffect(() => {
    if (autoFetch) {
      fetchProfile();
    }
  }, []); // Only fetch on mount

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updatePassword,
    uploadAvatar,
    updateInterests,
    refetch,
  };
};

