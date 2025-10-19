import { useUser } from "@/src/hooks/useUser";
import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SignupData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupScreen() {
  const [formData, setFormData] = useState<SignupData>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const { signup } = useUser();

  const handleInputChange = (field: keyof SignupData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setTimeout(() => {
          setIsKeyboardVisible(false);
        }, 100);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const validateForm = (): string | null => {
    if (!formData.first_name.trim()) {
      return "Please enter your first name";
    }
    if (!formData.last_name.trim()) {
      return "Please enter your last name";
    }
    if (!formData.email.trim()) {
      return "Please enter your email";
    }
    if (!formData.email.includes("@")) {
      return "Please enter a valid email";
    }
    if (!formData.password) {
      return "Please enter a password";
    }
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  };

  const handleSignup = async () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert("Error", validationError);
      return;
    }

    setIsLoading(true);
    try {
      
      const response = await signup({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
      });
      
      // Navigate to interests selection screen
      router.push({
        pathname: "/auth/select-interests" as any,
        params: { email: formData.email },
      });
    } catch (error) {
      console.error("Signup Error:", error);
      Alert.alert(
        "Signup Failed",
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView 
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="flex-1 px-5 pt-8 mb-4 flex flex-col justify-between h-full bg-white">
            {/* Main Content */}
            <View className="flex-1">
            <Text className="text-[23px] text-[#151B23] font-poppins-bold mb-2">
              Welcome to{" "}
              <Text className="text-brand-blue text-[23px] font-poppins">
                BeAtIt
              </Text>
            </Text>
            <Text className="text-base text-[#798CA3] leading-6">
              Add your email and Create a password, to get onboard{" "}
            </Text>

            {/* Form */}
            <View className="mb-8 mt-[26px]">
              <View className="mb-5">
                <TextInput
                  className="border border-gray-200 rounded-xl px-4 py-4 text-base text-gray-800"
                  placeholder="First Name"
                  placeholderTextColor="#999"
                  value={formData.first_name}
                  onChangeText={(value) => handleInputChange("first_name", value)}
                  autoCapitalize="words"
                  autoCorrect={false}
                  autoFocus={false}
                />
              </View>

              <View className="mb-5">
                <TextInput
                  className="border border-gray-200 rounded-xl px-4 py-4 text-base text-gray-800"
                  placeholder="Last Name"
                  placeholderTextColor="#999"
                  value={formData.last_name}
                  onChangeText={(value) => handleInputChange("last_name", value)}
                  autoCapitalize="words"
                  autoCorrect={false}
                  autoFocus={false}
                />
              </View>

              <View className="mb-5">
                <TextInput
                  className="border border-gray-200 rounded-xl px-4 py-4 text-base text-gray-800"
                  placeholder="Email"
                  placeholderTextColor="#999"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange("email", value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus={false}
                />
              </View>

              <View className="mb-5">
                <TextInput
                  className="border border-gray-200 rounded-xl px-4 py-4 text-base text-gray-800"
                  placeholder="Password"
                  placeholderTextColor="#999"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange("password", value)}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus={false}
                />
              </View>

              <View className="mb-5">
                <TextInput
                  className="border border-gray-200 rounded-xl px-4 py-4 text-base text-gray-800"
                  placeholder="Repeat Password"
                  placeholderTextColor="#999"
                  value={formData.confirmPassword}
                  onChangeText={(value) =>
                    handleInputChange("confirmPassword", value)
                  }
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus={false}
                />
              </View>

              <TouchableOpacity className="items-center mt-10 py-2 px-4 bg-[#F6F6F6] rounded-3xl w-fit mx-auto">
                <Text className="text-[#324C6B] text-sm font-poppins-bold">
                  Sign up with Google
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          
          <View className="flex-row items-center justify-center">
            <Image
              source={require("@/assets/images/splash.png")}
              style={{ width: 120, height: 64 }}
              resizeMode="contain"
            />
          </View>
          {/* Footer */}
          <View className="pt-5">
            <TouchableOpacity
              className={`bg-brand-blue rounded-full py-4 items-center mb-4 ${isLoading ? "opacity-60" : ""}`}
              onPress={handleSignup}
              disabled={isLoading}
            >
              <Text className="text-white text-base font-poppins-medium">
                {isLoading ? "Creating Account..." : "Create Account"}
              </Text>
            </TouchableOpacity>

            <Link href="/auth/login" asChild>
              <TouchableOpacity className="mt-4 mb-2 bg-[#F6F6F6] px-3 py-2 w-fit rounded-full flex mx-auto">
                <Text className="text-[#324C6B] text-center">
                  Already have an account?{" "}
                  <Text className="text-[#151B23]">Login</Text>
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
