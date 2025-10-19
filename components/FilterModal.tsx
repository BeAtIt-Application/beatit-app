import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onApply?: () => void;
  onClear?: () => void;
}

export function FilterModal({ 
  visible, 
  onClose, 
  title, 
  children,
  onApply,
  onClear 
}: FilterModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200">
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <Text className="text-lg text-gray-600">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-lg font-bold text-[#1A1A2E]">{title}</Text>
          {onClear && (
            <TouchableOpacity onPress={onClear} activeOpacity={0.7}>
              <Text className="text-lg text-red-500">Clear</Text>
            </TouchableOpacity>
          )}
          {!onClear && <View className="w-16" />}
        </View>
        
        {/* Content */}
        <ScrollView className="flex-1">
          {children}
        </ScrollView>

        {/* Apply Button */}
        {onApply && (
          <View className="px-5 py-4 border-t border-gray-200">
            <TouchableOpacity 
              onPress={onApply}
              activeOpacity={0.8}
              className="bg-[#761CBC] rounded-xl py-4 items-center"
            >
              <Text className="text-white text-lg font-semibold">Apply Filters</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

