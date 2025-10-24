import { IconSymbol } from "@/components/ui/icon-symbol";
import { UpdateProfileRequest } from "@/src/api/profileApi";
import { useProfile } from "@/src/hooks/useProfile";
import { Image } from "expo-image";
import * as ImagePicker from 'expo-image-picker';
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditProfileScreen() {
  const { profile, loading, updateProfile, refetch, uploadAvatar } = useProfile();
  
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    username: "",
    artist_tag: "",
    bio: "",
    city_from: "",
    country_from: "",
    contact_phone: "",
    contact_email: "",
    instagram_link: "",
    facebook_link: "",
    youtube_link: "",
    spotify_link: "",
    soundcloud_link: "",
  });

  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
        phone_number: profile.phone_number || "",
        username: profile.username || "",
        artist_tag: profile.artist_tag || "",
        bio: profile.bio || "",
        city_from: profile.city_from || "",
        country_from: profile.country_from || "",
        contact_phone: profile.contact_phone || "",
        contact_email: profile.contact_email || "",
        instagram_link: profile.instagram_link || "",
        facebook_link: profile.facebook_link || "",
        youtube_link: profile.youtube_link || "",
        spotify_link: profile.spotify_link || "",
        soundcloud_link: profile.soundcloud_link || "",
      });
    }
  }, [profile]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name || formData.first_name.length < 2) {
      newErrors.first_name = "First name must be at least 2 characters";
    }

    if (!formData.last_name || formData.last_name.length < 2) {
      newErrors.last_name = "Last name must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      
      // Clean up the data - only send non-empty fields
      const cleanedData: any = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email, // Required by backend for validation
      };
      
      // Add optional fields only if they have values
      if (formData.phone_number) cleanedData.phone_number = formData.phone_number;
      if (formData.username) cleanedData.username = formData.username;
      if (formData.artist_tag) cleanedData.artist_tag = formData.artist_tag;
      if (formData.bio) cleanedData.bio = formData.bio;
      if (formData.city_from) cleanedData.city_from = formData.city_from;
      if (formData.country_from) cleanedData.country_from = formData.country_from;
      if (formData.contact_phone) cleanedData.contact_phone = formData.contact_phone;
      if (formData.contact_email) cleanedData.contact_email = formData.contact_email;
      if (formData.instagram_link) cleanedData.instagram_link = formData.instagram_link;
      if (formData.facebook_link) cleanedData.facebook_link = formData.facebook_link;
      if (formData.youtube_link) cleanedData.youtube_link = formData.youtube_link;
      if (formData.spotify_link) cleanedData.spotify_link = formData.spotify_link;
      if (formData.soundcloud_link) cleanedData.soundcloud_link = formData.soundcloud_link;
      
      await updateProfile(cleanedData);
      
      // Refetch the updated profile data
      await refetch();
      
      // Navigate back to profile page
      router.back();
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to update profile"
      );
      setSaving(false);
    }
  };

  const updateField = (field: keyof UpdateProfileRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAvatarUpload = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to upload an avatar.');
        return;
      }

      // Show action sheet for camera or gallery
      Alert.alert(
        'Select Avatar',
        'Choose how you want to select your avatar',
        [
          { text: 'Camera', onPress: () => openImagePicker('camera') },
          { text: 'Photo Library', onPress: () => openImagePicker('library') },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to request permissions');
    }
  };

  const openImagePicker = async (source: 'camera' | 'library') => {
    try {
      setUploadingAvatar(true);

      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      };

      let result;
      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Please grant camera permissions to take a photo.');
          setUploadingAvatar(false);
          return;
        }
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        // Create a file object for React Native
        const file = {
          uri: asset.uri,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        } as any;
        
        // Upload the avatar
        await uploadAvatar(file);
        
        // Refetch profile to get updated avatar URLs
        await refetch();
        
        Alert.alert('Success', 'Avatar updated successfully!');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      Alert.alert('Error', 'Failed to upload avatar. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const avatarUrl = profile?.avatar_url || profile?.avatar_thumbnail || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

  if (loading && !profile) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 justify-center items-center bg-white">
          <ActivityIndicator size="large" color="#761CBC" />
          <Text className="text-gray-600 mt-4">Loading profile...</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-white"
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="relative bg-[#5271FF]" style={{ height: 160 }}>
            <TouchableOpacity
              onPress={() => router.back()}
              className="absolute top-12 left-5 w-10 h-10 bg-white rounded-full justify-center items-center shadow-lg z-10"
            >
              <IconSymbol name="chevron.left" size={20} color="black" />
            </TouchableOpacity>
       
            <View className="absolute top-12 right-5 z-10">
              <TouchableOpacity
                onPress={handleSave}
                disabled={saving}
                className="bg-white px-4 py-2 rounded-full"
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#761CBC" />
                ) : (
                  <Text className="text-[#761CBC] font-semibold">Save</Text>
                )}
              </TouchableOpacity>
            </View>

            <View className="absolute -bottom-16 left-0 right-0 items-center">
              <TouchableOpacity 
                onPress={handleAvatarUpload}
                disabled={uploadingAvatar}
                className="bg-white rounded-full p-2 shadow-lg"
              >
                <Image
                  source={{ uri: avatarUrl }}
                  style={{ width: 120, height: 120, borderRadius: 60 }}
                  contentFit="cover"
                />
                {uploadingAvatar && (
                  <View className="absolute inset-0 bg-black/50 rounded-full justify-center items-center">
                    <ActivityIndicator size="large" color="white" />
                  </View>
                )}
                <View className="absolute bottom-2 right-2 w-8 h-8 bg-[#5271FF] rounded-full justify-center items-center">
                  <IconSymbol name="photo" size={16} color="white" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form */}
          <View className="mt-20 px-5 pb-8">
            {/* Personal Information */}
            <View className="mb-6">
              <Text className="text-lg font-bold text-brand-purple mb-3">
                Personal Information
              </Text>

              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-2">
                  First Name <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  className="bg-gray-50 rounded-xl px-4 py-3 text-base"
                  value={formData.first_name}
                  onChangeText={(text) => updateField("first_name", text)}
                  placeholder="Enter first name"
                />
                {errors.first_name && (
                  <Text className="text-red-500 text-sm mt-1">{errors.first_name}</Text>
                )}
              </View>

              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-2">
                  Last Name <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  className="bg-gray-50 rounded-xl px-4 py-3 text-base"
                  value={formData.last_name}
                  onChangeText={(text) => updateField("last_name", text)}
                  placeholder="Enter last name"
                />
                {errors.last_name && (
                  <Text className="text-red-500 text-sm mt-1">{errors.last_name}</Text>
                )}
              </View>

              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-2">Email</Text>
                <TextInput
                  className="bg-gray-200 rounded-xl px-4 py-3 text-base text-gray-500"
                  value={formData.email}
                  editable={false}
                  placeholder="Email address"
                />
                <Text className="text-xs text-gray-500 mt-1">Email cannot be changed</Text>
              </View>

              {profile?.role !== 5 && (
              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-2">Username</Text>
                <TextInput
                  className="bg-gray-50 rounded-xl px-4 py-3 text-base"
                  value={formData.username}
                  onChangeText={(text) => updateField("username", text)}
                  placeholder="Enter username"
                  autoCapitalize="none"
                />
              </View>
              )}

              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-2">Phone Number</Text>
                <TextInput
                  className="bg-gray-50 rounded-xl px-4 py-3 text-base"
                  value={formData.phone_number}
                  onChangeText={(text) => updateField("phone_number", text)}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Artist/Professional Info */}
            <View className="mb-6">
              <Text className="text-lg font-bold text-brand-purple mb-3">
                Professional Info
              </Text>
              
              {profile?.role !== 5 && (
              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-2">Artist Tag</Text>
                <TextInput
                  className="bg-gray-50 rounded-xl px-4 py-3 text-base"
                  value={formData.artist_tag}
                  onChangeText={(text) => updateField("artist_tag", text)}
                  placeholder="e.g., DJ & Producer"
                />
              </View>
              )}

              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-2">Bio</Text>
                <TextInput
                  className="bg-gray-50 rounded-xl px-4 py-3 text-base"
                  value={formData.bio}
                  onChangeText={(text) => updateField("bio", text)}
                  placeholder="Tell us about yourself"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Location */}
            <View className="mb-6">
              <Text className="text-lg font-bold text-brand-purple mb-3">
                Location
              </Text>

              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-2">City</Text>
                <TextInput
                  className="bg-gray-50 rounded-xl px-4 py-3 text-base"
                  value={formData.city_from}
                  onChangeText={(text) => updateField("city_from", text)}
                  placeholder="Enter city"
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-2">Country</Text>
                <TextInput
                  className="bg-gray-50 rounded-xl px-4 py-3 text-base"
                  value={formData.country_from}
                  onChangeText={(text) => updateField("country_from", text)}
                  placeholder="Enter country"
                />
              </View>
            </View>


            {/* Contact Information */}
            {profile?.role !== 5 && (
            <View className="mb-6">
              <Text className="text-lg font-bold text-brand-purple mb-3">
                Contact Information
              </Text>

              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-2">Contact Email</Text>
                <TextInput
                  className="bg-gray-50 rounded-xl px-4 py-3 text-base"
                  value={formData.contact_email}
                  onChangeText={(text) => updateField("contact_email", text)}
                  placeholder="Enter contact email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-2">Contact Phone</Text>
                <TextInput
                  className="bg-gray-50 rounded-xl px-4 py-3 text-base"
                  value={formData.contact_phone}
                  onChangeText={(text) => updateField("contact_phone", text)}
                  placeholder="Enter contact phone"
                  keyboardType="phone-pad"
                />
              </View>
            </View>
            )}

            {/* Social Media - Hide for role id 5 */}
            {profile?.role !== 5 && (
              <View className="mb-6">
                <Text className="text-lg font-bold text-brand-purple mb-3">
                  Social Media
                </Text>

              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-2">Instagram</Text>
                <TextInput
                  className="bg-gray-50 rounded-xl px-4 py-3 text-base"
                  value={formData.instagram_link}
                  onChangeText={(text) => updateField("instagram_link", text)}
                  placeholder="Instagram profile URL"
                  autoCapitalize="none"
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-2">Facebook</Text>
                <TextInput
                  className="bg-gray-50 rounded-xl px-4 py-3 text-base"
                  value={formData.facebook_link}
                  onChangeText={(text) => updateField("facebook_link", text)}
                  placeholder="Facebook profile URL"
                  autoCapitalize="none"
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-2">YouTube</Text>
                <TextInput
                  className="bg-gray-50 rounded-xl px-4 py-3 text-base"
                  value={formData.youtube_link}
                  onChangeText={(text) => updateField("youtube_link", text)}
                  placeholder="YouTube channel URL"
                  autoCapitalize="none"
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-2">Spotify</Text>
                <TextInput
                  className="bg-gray-50 rounded-xl px-4 py-3 text-base"
                  value={formData.spotify_link}
                  onChangeText={(text) => updateField("spotify_link", text)}
                  placeholder="Spotify profile URL"
                  autoCapitalize="none"
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-2">SoundCloud</Text>
                <TextInput
                  className="bg-gray-50 rounded-xl px-4 py-3 text-base"
                  value={formData.soundcloud_link}
                  onChangeText={(text) => updateField("soundcloud_link", text)}
                  placeholder="SoundCloud profile URL"
                  autoCapitalize="none"
                />
              </View>
            </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

