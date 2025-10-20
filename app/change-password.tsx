import { IconSymbol } from "@/components/ui/icon-symbol";
import { UpdatePasswordRequest } from "@/src/api/profileApi";
import { useProfile } from "@/src/hooks/useProfile";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
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

export default function ChangePasswordScreen() {
  const { updatePassword } = useProfile(false);
  
  const [formData, setFormData] = useState<UpdatePasswordRequest>({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.current_password) {
      newErrors.current_password = "Current password is required";
    }

    if (!formData.password) {
      newErrors.password = "New password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = "Password confirmation is required";
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match";
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
      await updatePassword(formData);
      Alert.alert("Success", "Password updated successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to update password"
      );
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof UpdatePasswordRequest, value: string) => {
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

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-white"
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="relative bg-[#5271FF]" style={{ height: 140 }}>
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

            <View className="flex-1 justify-center items-center">
              <IconSymbol name="gear" size={40} color="white" />
            </View>
          </View>

          {/* Form */}
          <View className="px-5 py-8">
            <Text className="text-2xl font-bold text-center text-[#1A1A2E] mb-2">
              Change Password
            </Text>
            <Text className="text-sm text-gray-600 text-center mb-8">
              Please enter your current password and choose a new one
            </Text>

            {/* Current Password */}
            <View className="mb-6">
              <Text className="text-lg font-bold text-brand-purple mb-3">
                Current Password
              </Text>

              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-2">
                  Current Password <Text className="text-red-500">*</Text>
                </Text>
                <View className="relative">
                  <TextInput
                    className="bg-gray-50 rounded-xl px-4 py-3 pr-12 text-base"
                    value={formData.current_password}
                    onChangeText={(text) => updateField("current_password", text)}
                    placeholder="Enter current password"
                    secureTextEntry={!showCurrentPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    className="absolute right-4 top-3"
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    <IconSymbol 
                      name={showCurrentPassword ? "eye.slash" : "eye"} 
                      size={20} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                </View>
                {errors.current_password && (
                  <Text className="text-red-500 text-sm mt-1">{errors.current_password}</Text>
                )}
              </View>
            </View>

            {/* New Password */}
            <View className="mb-6">
              <Text className="text-lg font-bold text-brand-purple mb-3">
                New Password
              </Text>

              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-2">
                  New Password <Text className="text-red-500">*</Text>
                </Text>
                <View className="relative">
                  <TextInput
                    className="bg-gray-50 rounded-xl px-4 py-3 pr-12 text-base"
                    value={formData.password}
                    onChangeText={(text) => updateField("password", text)}
                    placeholder="Enter new password (min 8 characters)"
                    secureTextEntry={!showNewPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    className="absolute right-4 top-3"
                    onPress={() => setShowNewPassword(!showNewPassword)}
                  >
                    <IconSymbol 
                      name={showNewPassword ? "eye.slash" : "eye"} 
                      size={20} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>
                )}
              </View>

              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-2">
                  Confirm New Password <Text className="text-red-500">*</Text>
                </Text>
                <View className="relative">
                  <TextInput
                    className="bg-gray-50 rounded-xl px-4 py-3 pr-12 text-base"
                    value={formData.password_confirmation}
                    onChangeText={(text) => updateField("password_confirmation", text)}
                    placeholder="Confirm new password"
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    className="absolute right-4 top-3"
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <IconSymbol 
                      name={showConfirmPassword ? "eye.slash" : "eye"} 
                      size={20} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                </View>
                {errors.password_confirmation && (
                  <Text className="text-red-500 text-sm mt-1">{errors.password_confirmation}</Text>
                )}
              </View>
            </View>

            {/* Password Requirements */}
            <View className="bg-gray-50 rounded-xl p-4 mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Password Requirements:
              </Text>
              <Text className="text-sm text-gray-600 mb-1">• At least 8 characters</Text>
              <Text className="text-sm text-gray-600">• Must match confirmation</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

