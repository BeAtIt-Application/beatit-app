import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { router, Tabs } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#000000",
          tabBarInactiveTintColor: "#9CA3AF",
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            height: 75 + insets.bottom, // Include safe area in height
            paddingBottom: 20 + insets.bottom, // Add safe area to padding
            paddingTop: 10,
            marginBottom: 0, // Remove margin since we're including safe area in height
            position: "absolute",
            borderTopLeftRadius: 20,
            boxShadow: '0px -2px 4px 0px rgba(0, 0, 0, 0.1)',
            borderTopRightRadius: 20,
            bottom: 0, // Ensure it's at the very bottom
            left: 0,
            right: 0,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
            marginTop: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Feed",
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol size={24} name="house" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="events"
          options={{
            title: "Events",
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol size={24} name="calendar" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="venues"
          options={{
            title: "Venues",
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol size={24} name="building.2" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol size={24} name="person" color={color} />
            ),
          }}
        />
      </Tabs>

      {/* Floating Map Button with Label */}
      <View
        style={{
          position: "absolute",
          bottom: 50 + insets.bottom, // Keep same positioning relative to tab bar
          alignSelf: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}
      >
        <TouchableOpacity
          style={{
            width: 62,
            height: 62,
            borderRadius: 100,
            backgroundColor: "#FFFFFF",
            justifyContent: "center",
            alignItems: "center",
            borderTopWidth: 2,
            borderTopColor: "#FFFFFF",
            // Box shadow only on top
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: -2, // Negative value to cast shadow upward
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4, // For Android
          }}
          onPress={() => router.push("/map")}
        >
          <IconSymbol size={24} name="pin" color="#56B568" />
          <Text
            style={{
              fontSize: 12,
              fontWeight: "500",
              color: "#56B568",  // Active tab color
            }}
          >
            Map
          </Text>
        </TouchableOpacity>
        
        {/* Map Label - matching tab bar style */}

      </View>
    </View>
  );
}
