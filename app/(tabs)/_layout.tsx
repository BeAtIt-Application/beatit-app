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
            height: 80,
            paddingBottom: 20,
            paddingTop: 10,
            marginBottom: insets.bottom,
            position: "absolute",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
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
          bottom: 50 + insets.bottom,
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
