import { API_CONFIG } from '@/src/api/config';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DebugScreen() {
  const [apiInfo, setApiInfo] = useState({
    baseURL: API_CONFIG.baseURL,
    signupEndpoint: API_CONFIG.endpoints.auth.signup,
    fullSignupUrl: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth.signup}`,
    envVarValue: process.env.EXPO_PUBLIC_API_URL || 'Not set'
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-4">API Debug Info</Text>
        
        <View className="bg-gray-100 p-4 rounded-xl mb-4">
          <Text className="font-bold">Base URL:</Text>
          <Text className="mb-2">{apiInfo.baseURL}</Text>
          
          <Text className="font-bold">Signup Endpoint:</Text>
          <Text className="mb-2">{apiInfo.signupEndpoint}</Text>
          
          <Text className="font-bold">Full Signup URL:</Text>
          <Text className="mb-2">{apiInfo.fullSignupUrl}</Text>
          
          <Text className="font-bold">EXPO_PUBLIC_API_URL:</Text>
          <Text>{apiInfo.envVarValue}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
