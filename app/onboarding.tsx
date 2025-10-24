import { markOnboardingAsSeen } from "@/src/utils/onboarding";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  const handleCreateAccount = async () => {
    await markOnboardingAsSeen();
    router.replace("/auth/signup");
  };

  const handleLogin = async () => {
    await markOnboardingAsSeen();
    router.replace("/auth/login");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View className="px-5 pt-9 flex flex-col items-center justify-between h-full">
        <View className="flex flex-col items-center gap-4">
          <Text className="font-poppins-extrabold text-3xl text-[#151B23]">
            Events, experiences and lifestyle; the upgrade you need.
          </Text>
          <Text className="font-inter text-base text-[#375476] ">
            BeAtIt gives you events, experiences, venues and everything you
            need to make the most of your day to day life.
          </Text>
        </View>
        <Image
          source={require("@/assets/images/Onboard.png")}
          className="w-full"
          resizeMode="contain"
        />
        <View className="flex flex-col gap-4 w-full">
          <TouchableOpacity
            onPress={handleCreateAccount}
            className="bg-brand-blue py-4 px-6 w-full rounded-full mt-8"
          >
            <Text className="font-poppins-semibold text-white text-center text-lg">
              Create Account
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogin}
            className="mt-4 mb-2 bg-[#F6F6F6] px-3 py-2 w-fit rounded-full flex mx-auto"
          >
            <Text className=" text-[#324C6B] text-center">
              Already have an account?{" "}
              <Text className=" text-[#151B23]">Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
