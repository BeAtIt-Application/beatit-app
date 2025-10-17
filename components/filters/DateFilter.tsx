import { FilterModal } from "@/components/FilterModal";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface DateRange {
  from: string;
  to: string;
  label: string;
}

interface DateFilterProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (dateRange: DateRange | null) => void;
  selectedDateRange?: DateRange | null;
}

const getDateRanges = (): DateRange[] => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const thisWeekEnd = new Date(today);
  thisWeekEnd.setDate(today.getDate() + (7 - today.getDay()));
  
  const nextWeekStart = new Date(thisWeekEnd);
  nextWeekStart.setDate(nextWeekStart.getDate() + 1);
  const nextWeekEnd = new Date(nextWeekStart);
  nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
  
  const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  return [
    {
      label: "Today",
      from: formatDate(today),
      to: formatDate(today),
    },
    {
      label: "Tomorrow",
      from: formatDate(tomorrow),
      to: formatDate(tomorrow),
    },
    {
      label: "This Week",
      from: formatDate(today),
      to: formatDate(thisWeekEnd),
    },
    {
      label: "Next Week",
      from: formatDate(nextWeekStart),
      to: formatDate(nextWeekEnd),
    },
    {
      label: "This Month",
      from: formatDate(today),
      to: formatDate(thisMonthEnd),
    },
    {
      label: "Next Month",
      from: formatDate(nextMonthStart),
      to: formatDate(nextMonthEnd),
    },
  ];
};

export function DateFilter({ 
  visible, 
  onClose, 
  onSelect, 
  selectedDateRange 
}: DateFilterProps) {
  const [tempSelected, setTempSelected] = useState<DateRange | null>(selectedDateRange || null);
  const dateRanges = getDateRanges();

  useEffect(() => {
    if (visible) {
      setTempSelected(selectedDateRange || null);
    }
  }, [visible, selectedDateRange]);

  const handleSelect = (range: DateRange) => {
    setTempSelected(range);
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
      title="Select Date Range"
      onApply={handleApply}
      onClear={handleClear}
    >
      <View className="px-5 py-4">
        <Text className="text-sm text-gray-600 mb-4">
          Choose when you want to attend events
        </Text>
        
        <View className="gap-3">
          {dateRanges.map((range) => {
            const isSelected = tempSelected?.label === range.label;
            return (
              <TouchableOpacity
                key={range.label}
                onPress={() => handleSelect(range)}
                className={`p-4 rounded-xl border-2 ${
                  isSelected 
                    ? 'bg-[#761CBC]/10 border-[#761CBC]' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text 
                      className={`text-base font-semibold ${
                        isSelected ? 'text-[#761CBC]' : 'text-gray-800'
                      }`}
                    >
                      {range.label}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      {range.from === range.to 
                        ? range.from 
                        : `${range.from} to ${range.to}`}
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

