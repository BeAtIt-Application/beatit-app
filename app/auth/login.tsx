import { useUser } from "@/src/hooks/useUser";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const { login } = useUser();

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

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error instanceof Error ? error.message : "An error occurred"
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
          <View className="flex-1 ">
            <Text className="text-[23px] text-[#151B23] font-poppins-bold mb-2">
              Welcome to{" "}
              <Text className="text-[#5271FF] text-[23px] font-poppins">
                BeAtIt
              </Text>
            </Text>
            <Text className="text-base text-[#798CA3] leading-6">
              Welcome back! Please enter your details.{" "}
            </Text>

            {/* Form */}
            <View className="mb-8 mt-[26px]">
              <View className="mb-5">
                <TextInput
                  className="border border-gray-200 rounded-xl px-4 py-4 text-base  text-gray-800"
                  placeholder="Email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View className="mb-5">
                <TextInput
                  className="border border-gray-200 rounded-xl px-4 py-4 text-base  text-gray-800"
                  placeholder="Password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <TouchableOpacity className="items-center mt-6 py-2 px-4 bg-[#F6F6F6] rounded-3xl w-fit mx-auto"
                onPress={() => router.push("/auth/forgot-password")}>
                <Text className="text-[#5271FF] text-sm font-poppins-bold">
                  Forgot Password
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center mt-6 py-2 px-4 bg-[#F6F6F6] rounded-3xl w-fit mx-auto">
                <Text className="text-[#324C6B] text-sm font-poppins-bold">
                  Continue with Google
                </Text>
              </TouchableOpacity>
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
              className={`bg-brand-blue rounded-full py-4 items-center mb-4 ${isLoading ? "opacity-60" : ""}`}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text className="text-white text-base font-poppins-medium">
                {isLoading ? "Signing In..." : "Login"}
              </Text>
            </TouchableOpacity>

            <Link href="/auth/signup" asChild>
              <TouchableOpacity className="mt-4 mb-2 bg-[#F6F6F6] px-3 py-2 w-fit rounded-full flex mx-auto">
                <Text className=" text-[#324C6B] text-center">
                  Don't have an account?{" "}
                  <Text className=" text-[#151B23]">Signup</Text>
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
