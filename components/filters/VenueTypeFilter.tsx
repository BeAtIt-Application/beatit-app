import { FilterModal } from "@/components/FilterModal";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface VenueTypeFilterProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (venueType: string | null) => void;
  selectedVenueType?: string | null;
}

const VENUE_TYPE_OPTIONS = [
  { id: "club", label: "Club", icon: "🎵" },
  { id: "bar", label: "Bar", icon: "🍺" },
  { id: "concert-hall", label: "Concert Hall", icon: "🎭" },
  { id: "outdoor", label: "Outdoor Venue", icon: "🌳" },
  { id: "restaurant", label: "Restaurant", icon: "🍽️" },
  { id: "cafe", label: "Café", icon: "☕" },
  { id: "theater", label: "Theater", icon: "🎬" },
  { id: "arena", label: "Arena", icon: "🏟️" },
  { id: "festival-ground", label: "Festival Ground", icon: "🎪" },
  { id: "lounge", label: "Lounge", icon: "🛋️" },
];

export function VenueTypeFilter({ 
  visible, 
  onClose, 
  onSelect, 
  selectedVenueType 
}: VenueTypeFilterProps) {
  const [tempSelected, setTempSelected] = useState<string | null>(selectedVenueType || null);

  useEffect(() => {
    if (visible) {
      setTempSelected(selectedVenueType || null);
    }
  }, [visible, selectedVenueType]);

  const handleSelect = (venueTypeId: string) => {
    setTempSelected(venueTypeId);
  };

  const handleApply = () => {
    onSelect(tempSelected);
    onClose();
  };

  const handleClear = () => {
    setTempSelected(null);
  };

  return (
    <FilterModal
      visible={visible}
      onClose={onClose}
      title="Select Venue Type"
      onApply={handleApply}
      onClear={handleClear}
    >
      <View className="px-5 py-4">
        <Text className="text-sm text-gray-600 mb-4">
          Choose the type of venue you're looking for
        </Text>
        
        {/* Venue Type Grid */}
        <View className="gap-3">
          {VENUE_TYPE_OPTIONS.map((venueType) => {
            const isSelected = tempSelected === venueType.id;
            return (
              <TouchableOpacity
                key={venueType.id}
                onPress={() => handleSelect(venueType.id)}
                className={`p-4 rounded-xl border-2 ${
                  isSelected 
                    ? 'bg-[#761CBC]/10 border-[#761CBC]' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <Text className="text-2xl mr-3">{venueType.icon}</Text>
                    <Text 
                      className={`text-base ${
                        isSelected ? 'text-[#761CBC] font-semibold' : 'text-gray-800'
                      }`}
                    >
                      {venueType.label}
                    </Text>
                  </View>
                  {isSelected && (
                    <View className="w-6 h-6 bg-[#761CBC] rounded-full items-center justify-center">
                      <Text className="text-white text-xs">✓</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </FilterModal>
  );
}

