import { FilterModal } from "@/components/FilterModal";
import { useVenueTypes } from "@/src/hooks/useTaxonomies";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface VenueTypeFilterProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (venueType: { id: number; name: string } | null) => void;
  selectedVenueType?: { id: number; name: string } | null;
}

export function VenueTypeFilter({ 
  visible, 
  onClose, 
  onSelect, 
  selectedVenueType 
}: VenueTypeFilterProps) {
  const { venueTypes, isLoading } = useVenueTypes();
  const [tempSelected, setTempSelected] = useState<{ id: number; name: string } | null>(selectedVenueType || null);

  useEffect(() => {
    if (visible) {
      setTempSelected(selectedVenueType || null);
    }
  }, [visible, selectedVenueType]);

  const handleSelect = (venueType: { id: number; name: string }) => {
    setTempSelected(venueType);
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
        
        {/* Loading State */}
        {isLoading && (
          <View className="py-12 items-center">
            <Text className="text-gray-400 text-base">Loading venue types...</Text>
          </View>
        )}

        {/* Venue Type Grid */}
        {!isLoading && venueTypes && venueTypes.length > 0 && (
          <View className="gap-3">
            {venueTypes.map((venueType) => {
              const isSelected = tempSelected?.id === venueType.id;
              return (
                <TouchableOpacity
                  key={venueType.id}
                  onPress={() => handleSelect({ id: venueType.id, name: venueType.name })}
                  className={`p-4 rounded-xl border-2 ${
                    isSelected 
                      ? 'bg-[#761CBC]/10 border-[#761CBC]' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                      <Text 
                        className={`text-base ${
                          isSelected ? 'text-[#761CBC] font-semibold' : 'text-gray-800'
                        }`}
                      >
                        {venueType.name}
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
        )}

        {/* Empty State */}
        {!isLoading && (!venueTypes || venueTypes.length === 0) && (
          <View className="py-12 items-center">
            <Text className="text-gray-400 text-base">No venue types available</Text>
          </View>
        )}
      </View>
    </FilterModal>
  );
}

