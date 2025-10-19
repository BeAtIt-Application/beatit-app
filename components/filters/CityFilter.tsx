import { FilterModal } from "@/components/FilterModal";
import { IconSymbol } from "@/components/ui/icon-symbol";
import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface CityFilterProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (city: string | null) => void;
  selectedCity?: string | null;
}

// Common cities in Macedonia - can be extended or fetched from API
const CITY_OPTIONS = [
  "Skopje",
  "Bitola",
  "Kumanovo",
  "Prilep",
  "Tetovo",
  "Veles",
  "Ohrid",
  "Gostivar",
  "Strumica",
  "Kavadarci",
  "Kočani",
  "Štip",
  "Gevgelija",
];

export function CityFilter({ 
  visible, 
  onClose, 
  onSelect, 
  selectedCity 
}: CityFilterProps) {
  const [tempSelected, setTempSelected] = useState<string | null>(selectedCity || null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (visible) {
      setTempSelected(selectedCity || null);
      setSearchQuery("");
    }
  }, [visible, selectedCity]);

  const filteredCities = CITY_OPTIONS.filter(city =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (city: string) => {
    setTempSelected(city);
  };

  const handleApply = () => {
    onSelect(tempSelected);
    onClose();
  };

  const handleClear = () => {
    setTempSelected(null);
    setSearchQuery("");
  };

  return (
    <FilterModal
      visible={visible}
      onClose={onClose}
      title="Select City"
      onApply={handleApply}
      onClear={handleClear}
    >
      <View className="px-5 py-4">
        <Text className="text-sm text-gray-600 mb-4">
          Choose a city to find events near you
        </Text>
        
        {/* Search Input */}
        <View className="bg-gray-100 rounded-xl px-4 mb-4 flex-row items-center">
          <IconSymbol name="magnifyingglass" size={20} color="#666" />
          <TextInput
            className="flex-1 ml-2 text-base py-3"
            placeholder="Search cities..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* City List */}
        <View className="gap-2">
          {filteredCities.map((city) => {
            const isSelected = tempSelected === city;
            return (
              <TouchableOpacity
                key={city}
                onPress={() => handleSelect(city)}
                activeOpacity={0.7}
                className={`p-4 rounded-xl border-2 flex-row justify-between items-center ${
                  isSelected 
                    ? 'bg-[#761CBC]/10 border-[#761CBC]' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <View className="flex-row items-center">
                  <IconSymbol name="location" size={20} color={isSelected ? "#761CBC" : "#666"} />
                  <Text 
                    className={`text-base ml-3 ${
                      isSelected ? 'text-[#761CBC] font-semibold' : 'text-gray-800'
                    }`}
                  >
                    {city}
                  </Text>
                </View>
                {isSelected && (
                  <View className="w-6 h-6 bg-[#761CBC] rounded-full items-center justify-center">
                    <Text className="text-white text-xs">✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {filteredCities.length === 0 && (
          <View className="py-8 items-center">
            <Text className="text-gray-400 text-base">No cities found</Text>
          </View>
        )}
      </View>
    </FilterModal>
  );
}

