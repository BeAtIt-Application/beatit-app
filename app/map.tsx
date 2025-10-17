import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { router } from "expo-router";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MapScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ThemedView className="flex-1">
        <ScrollView className="flex-1 px-4 pt-4">
          <View className="flex-1 justify-center items-center py-20">
            <IconSymbol name="location" size={80} color="#3AB795" />
            <ThemedText className="text-2xl font-bold mt-4 mb-2">
              Map
            </ThemedText>
            <ThemedText className="text-base opacity-70 text-center mb-8">
              Discover events and venues near you
            </ThemedText>

            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-brand-blue px-8 py-3 rounded-full"
            >
              <ThemedText className="text-white font-semibold">
                Go Back
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}




