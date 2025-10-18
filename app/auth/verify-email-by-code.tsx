import { authApi } from "@/src/api";
import { Link, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
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

export default function VerifyEmailByCodeScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState("");
  const [cooldown, setCooldown] = useState(0); // Start with 60 second cooldown
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Keyboard visibility detection
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

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleVerifyCode = async () => {
    if (!email) {
      Alert.alert("Error", "Email is missing");
      return;
    }

    if (!code || code.length < 6) {
      Alert.alert("Error", "Please enter a valid verification code");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await authApi.verifyEmailByCode({
        email,
        code,
      });

      if (response.user) {
        Alert.alert(
          "Success",
          "Your email has been verified successfully.",
          [
            {
              text: "Go to Login",
              onPress: () => router.replace("/auth/login"),
            },
          ]
        );
      } else {
        Alert.alert("Error", "Email verification failed. Please try again.");
      }
    } catch (error) {
      Alert.alert(
        "Verification Failed",
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (cooldown > 0 || isResending) return;

    if (!email) {
      Alert.alert("Error", "Email is missing");
      return;
    }

    setIsResending(true);
    try {
      await authApi.resendVerificationEmail(email);
      setCooldown(60);
      Alert.alert("Success", "Verification code sent successfully");
    } catch (error) {
      let errorMessage = "Failed to resend code";
      
      if (error instanceof Error) {
        // Handle specific "code already sent" error
        if (error.message.includes("verification code has already been sent")) {
          // Extract expiration time from error message if available
          const match = error.message.match(/(\d+)\s*minutes?/);
          const expirationMinutes = match ? parseInt(match[1]) : 15;
          const expirationSeconds = expirationMinutes * 60;
          
          // Set cooldown to match server expiration time
          setCooldown(expirationSeconds);
          
          errorMessage = `A verification code was already sent. Please check your email or wait ${expirationMinutes} minutes before requesting a new one.`;
        } else {
          errorMessage = error.message;
        }
      }
      
      Alert.alert("Cannot Resend Code", errorMessage);
    } finally {
      setIsResending(false);
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
                Verify Your Email
              </Text>
              <Text className="text-base text-[#798CA3] leading-6 mb-8">
                We've sent a verification code to:
              </Text>

              {/* Email Display */}
              <View className="bg-gray-100 px-4 py-3 rounded-xl mb-8">
                <Text className="text-base text-[#151B23] font-poppins-medium">
                  {email || "your email"}
                </Text>
              </View>

              {/* Code Input */}
              <Text className="text-base text-[#151B23] font-poppins-medium mb-2">
                Enter Verification Code
              </Text>
              <TextInput
                className="border border-gray-200 rounded-xl px-4 py-4 text-base text-gray-800 mb-6 text-center tracking-widest"
                placeholder="Enter 6-digit code"
                placeholderTextColor="#999"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus={false}
              />

              {/* Resend Code */}
              <TouchableOpacity
                onPress={handleResendCode}
                disabled={cooldown > 0 || isResending}
                className="items-center"
              >
                <Text
                  className={`text-sm ${
                    cooldown > 0 || isResending
                      ? "text-gray-400"
                      : "text-brand-blue"
                  }`}
                >
                  {isResending
                    ? "Sending..."
                    : cooldown > 0
                    ? (() => {
                        const minutes = Math.floor(cooldown / 60);
                        const seconds = cooldown % 60;
                        return minutes > 0 
                          ? `Resend code in ${minutes}m ${seconds}s`
                          : `Resend code in ${cooldown}s`;
                      })()
                    : "Resend verification code"}
                </Text>
              </TouchableOpacity>
            </View>

            {!isKeyboardVisible && (
              <View className="flex-row items-center justify-center mt-8 mb-4">
                <Text className="text-sm text-[#798CA3]">
                  Didn't receive the code? Check your spam folder.
                </Text>
              </View>
            )}

            {/* Footer */}
            <View className="pt-5">
              <TouchableOpacity
                className={`bg-brand-blue rounded-full py-4 items-center mb-4 ${
                  isVerifying ? "opacity-60" : ""
                }`}
                onPress={handleVerifyCode}
                disabled={isVerifying}
              >
                <Text className="text-white text-base font-poppins-medium">
                  {isVerifying ? "Verifying..." : "Verify Email"}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
