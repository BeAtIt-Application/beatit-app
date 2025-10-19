import { authApiWrapper } from "@/src/api/authApiSwitch";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  React.useEffect(() => {
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

  const handleSendResetEmail = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      await authApiWrapper.sendPasswordResetEmail(email);
      Alert.alert(
        "Reset Link Sent",
        "We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to send reset email. Please try again."
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
        <View className="flex-1 px-5 pt-8 mb-4 flex flex-col justify-between h-full bg-white">
          {/* Main Content */}
          <View className="flex-1">
            <Text className="text-[23px] text-[#151B23] font-poppins-bold mb-2">
              Forgot Password
            </Text>
            <Text className="text-base text-[#798CA3] leading-6 mb-8">
              Enter your email address and we'll send you a link to reset your password.
            </Text>

            {/* Form */}
            <View className="mb-8">
              <View className="mb-5">
                <TextInput
                  className="border border-gray-200 rounded-xl px-4 py-4 text-base text-gray-800"
                  placeholder="Email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus={true}
                />
              </View>
            </View>
          </View>

          {!isKeyboardVisible && (
            <View className="flex-row items-center justify-center">
              <Image
                source={require("@/assets/images/splash.png")}
                style={{ width: 120, height: 64 }}
                contentFit="contain"
              />
            </View>
          )}

          {/* Footer */}
          <View className="pt-5">
            <TouchableOpacity
              className={`bg-[#5271FF] rounded-full py-4 items-center mb-4 ${
                isLoading ? "opacity-60" : ""
              }`}
              onPress={handleSendResetEmail}
              disabled={isLoading}
            >
              <Text className="text-white text-base font-poppins-medium">
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Text>
            </TouchableOpacity>

            <Link href="/auth/login" asChild>
              <TouchableOpacity className="mt-5 bg-[#F6F6F6] px-3 py-2 w-fit rounded-full flex mx-auto">
                <Text className="text-[#324C6B] text-center">
                  Back to Login
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
