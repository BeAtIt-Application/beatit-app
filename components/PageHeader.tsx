import { IconSymbol } from "@/components/ui/icon-symbol";
import { Image } from "expo-image";
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

interface PageHeaderProps {
  title: string;
  colors?: readonly [string, string, ...string[]];
  filters?: string[];
  showSearch?: boolean;
  showLogo?: boolean;
  showNotification?: boolean;
  onSearchChange?: (text: string) => void;
  onFilterChange?: (filter: string) => void;
  selectedFilters?: Record<string, any>;
}

export function PageHeader({
  title,
  colors = ['#761CBC', '#5271FF'] as const,
  filters = [],
  showSearch = true,
  showLogo = true,
  showNotification = true,
  onSearchChange,
  onFilterChange,
  selectedFilters = {},
}: PageHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(filters.length > 0 ? filters[0] : "");

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (onSearchChange) {
      onSearchChange(text);
    }
  };

  const handleFilterPress = (filter: string) => {
    setSelectedFilter(filter);
    if (onFilterChange) {
      onFilterChange(filter);
    }
  };

  return (
    <LinearGradient 
      colors={colors} 
      start={{x: 1, y: 0}}
      end={{x: 0, y: 1}}
    >
      <View className="px-5 pt-4 pb-6">
        {/* Logo Section */}
        {showLogo && (
          <View className="flex-row justify-center items-center mb-8 relative">
            <View className="flex-row items-center">
              <Image
                source={require("@/assets/images/splash.png")}
                style={{ width: 120, height: 64 }}
                contentFit="contain"
              />
            </View>
            {showNotification && (
              <TouchableOpacity className="absolute right-0 w-8 h-8 bg-white bg-opacity-20 rounded-full justify-center items-center">
                <IconSymbol name="bell" size={16} color="black" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Title Section */}
        <View className="mb-2">
          <Text className="text-3xl font-bold text-white">{title}</Text>
        </View>

        {/* Search Bar */}
        {showSearch && (
          <View className="mb-4">
            <View className="bg-white rounded-xl px-4 flex-row items-center h-14">
              <IconSymbol name="magnifyingglass" size={20} color="#666" />
              <TextInput
                className="flex-1 ml-2 text-base"
                placeholder="Search..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={handleSearchChange}
              />
            </View>
          </View>
        )}

        {/* Filter Buttons - Horizontally Scrollable */}
        {filters.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
            className="mt-2"
          >
            {filters.map((filter, index) => {
              const hasActiveFilter = selectedFilters[filter] && (
                (Array.isArray(selectedFilters[filter]) && selectedFilters[filter].length > 0) ||
                (!Array.isArray(selectedFilters[filter]) && selectedFilters[filter] !== null)
              );
              
              return (
                <TouchableOpacity
                  key={filter}
                  onPress={() => handleFilterPress(filter)}
                  activeOpacity={0.7}
                  className={`px-10 py-3 rounded-full ${
                    index < filters.length - 1 ? 'mr-3' : ''
                  } ${
                    hasActiveFilter 
                      ? 'bg-white border-2 border-white/50' 
                      : 'bg-white'
                  }`}
                >
                  <Text
                    className={`text-md font-medium ${
                      hasActiveFilter ? 'text-[#761CBC] font-bold' : 'text-[#761CBC]'
                    }`}
                  >
                    {filter}
                    {hasActiveFilter && ' ✓'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>
    </LinearGradient>
  );
}
