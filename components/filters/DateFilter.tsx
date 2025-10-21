import { FilterModal } from "@/components/FilterModal";
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

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

const formatDate = (date: Date) => date.toISOString().split('T')[0];

const formatDisplayDate = (date: Date) => {
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear();
  
  // Add ordinal suffix to day
  const getOrdinalSuffix = (day: number) => {
    if (day >= 11 && day <= 13) {
      return 'th';
    }
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  
  return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
};

const parseDisplayDate = (dateString: string): Date => {
  // Parse formatted date strings like "15th Dec 2024" back to Date objects
  const parts = dateString.split(' ');
  if (parts.length !== 3) return new Date();
  
  const day = parseInt(parts[0].replace(/\D/g, '')); // Remove ordinal suffix
  const monthName = parts[1];
  const year = parseInt(parts[2]);
  
  const monthMap: { [key: string]: number } = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  
  const month = monthMap[monthName];
  if (month === undefined || isNaN(day) || isNaN(year)) return new Date();
  
  return new Date(year, month, day);
};

const getDateRanges = (): DateRange[] => {
  const today = new Date();
  
  // This Week: from today to end of current week (next Sunday)
  // If today is Sunday, it will be just today (0 days added)
  const thisWeekEnd = new Date(today);
  const daysUntilSunday = today.getDay() === 0 ? 0 : (7 - today.getDay());
  thisWeekEnd.setDate(today.getDate() + daysUntilSunday);
  
  // Next 2 weeks from today
  const next2WeeksEnd = new Date(today);
  next2WeeksEnd.setDate(today.getDate() + 14);
  
  const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  const thisYearEnd = new Date(today.getFullYear(), 11, 31); // December 31st

  return [
    {
      label: "Today",
      from: formatDisplayDate(today),
      to: formatDisplayDate(today),
    },
    {
      label: "This Week",
      from: formatDisplayDate(today),
      to: formatDisplayDate(thisWeekEnd),
    },
    {
      label: "Next 2 Weeks",
      from: formatDisplayDate(today),
      to: formatDisplayDate(next2WeeksEnd),
    },
    {
      label: "This Month",
      from: formatDisplayDate(today),
      to: formatDisplayDate(thisMonthEnd),
    },
    {
      label: "This Year",
      from: formatDisplayDate(today),
      to: formatDisplayDate(thisYearEnd),
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
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState(new Date());
  const [customEndDate, setCustomEndDate] = useState(new Date());
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(true);
  const [customDateRange, setCustomDateRange] = useState<DateRange | null>(null);
  const dateRanges = getDateRanges();

  useEffect(() => {
    if (visible) {
      setTempSelected(selectedDateRange || null);
      setShowCustomDatePicker(false);
      setIsSelectingStartDate(true);
      setCustomStartDate(new Date());
      setCustomEndDate(new Date());
      
      // If the selected range is a custom range, populate the custom dates
      if (selectedDateRange?.label === "Custom Range") {
        setCustomStartDate(parseDisplayDate(selectedDateRange.from));
        setCustomEndDate(parseDisplayDate(selectedDateRange.to));
        setCustomDateRange(selectedDateRange);
      } else {
        setCustomDateRange(null);
      }
    }
  }, [visible, selectedDateRange]);

  const handleSelect = (range: DateRange) => {
    setTempSelected(range);
    setShowCustomDatePicker(false);
  };

  const handleCustomDateSelect = () => {
    // Just select the custom range option, don't open the picker
    setShowCustomDatePicker(false);
    setIsSelectingStartDate(true);
    // Don't reset dates if we already have a custom range
    if (!customDateRange) {
      setCustomStartDate(new Date());
      setCustomEndDate(new Date());
    }
    
    // Create a default custom range if none exists
    if (!customDateRange) {
      const defaultRange: DateRange = {
        from: formatDisplayDate(new Date()),
        to: formatDisplayDate(new Date()),
        label: "Custom Range"
      };
      setCustomDateRange(defaultRange);
      setTempSelected(defaultRange);
    } else {
      setTempSelected(customDateRange);
    }
  };

  const handleStartDateSelect = () => {
    setIsSelectingStartDate(true);
    setShowCustomDatePicker(true);
  };

  const handleEndDateSelect = () => {
    setIsSelectingStartDate(false);
    setShowCustomDatePicker(true);
  };

  const handleDatePickerChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowCustomDatePicker(false);
    }
    
    if (selectedDate) {
      if (isSelectingStartDate) {
        setCustomStartDate(selectedDate);
        // If end date is before start date, update end date
        if (selectedDate > customEndDate) {
          setCustomEndDate(selectedDate);
        }
      } else {
        setCustomEndDate(selectedDate);
        // If start date is after end date, update start date
        if (selectedDate < customStartDate) {
          setCustomStartDate(selectedDate);
        }
      }
      
      // Create/update custom date range
      const startDate = isSelectingStartDate ? selectedDate : customStartDate;
      const endDate = isSelectingStartDate ? customEndDate : selectedDate;
      
      const customRange: DateRange = {
        from: formatDisplayDate(startDate),
        to: formatDisplayDate(endDate),
        label: "Custom Range"
      };
      
      setCustomDateRange(customRange);
      setTempSelected(customRange);
    }
  };

  const handleApply = () => {
    onSelect(tempSelected);
    onClose();
  };

  const handleClear = () => {
    setTempSelected(null);
    setShowCustomDatePicker(false);
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
                activeOpacity={0.7}
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
          
          {/* Custom Date Range Option */}
          <TouchableOpacity
            onPress={handleCustomDateSelect}
            activeOpacity={0.7}
            className={`p-4 rounded-xl border-2 ${
              tempSelected?.label === "Custom Range"
                ? 'bg-[#761CBC]/10 border-[#761CBC]' 
                : 'bg-white border-gray-200'
            }`}
          >
            <View className="flex-row justify-between items-center">
              <View>
                <Text 
                  className={`text-base font-semibold ${
                    tempSelected?.label === "Custom Range" ? 'text-[#761CBC]' : 'text-gray-800'
                  }`}
                >
                  Custom Range
                </Text>
                <Text className="text-sm text-gray-500 mt-1">
                  Select your own date range
                </Text>
              </View>
              {tempSelected?.label === "Custom Range" && (
                <View className="w-6 h-6 bg-[#761CBC] rounded-full items-center justify-center">
                  <Text className="text-white text-xs">✓</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Custom Date Range Selection */}
        {tempSelected?.label === "Custom Range" && (
          <View className="mt-4 p-4 bg-gray-50 rounded-xl">
            <Text className="text-sm font-medium text-gray-700 mb-3">
              Custom Date Range
            </Text>
            
            {/* Start Date */}
            <TouchableOpacity
              onPress={handleStartDateSelect}
              activeOpacity={0.7}
              className="mb-3 p-3 bg-white rounded-lg border border-gray-200"
            >
              <Text className="text-xs text-gray-500 mb-1">Start Date</Text>
              <Text className="text-base text-gray-800">
                {formatDisplayDate(customStartDate)}
              </Text>
            </TouchableOpacity>
            
            {/* End Date */}
            <TouchableOpacity
              onPress={handleEndDateSelect}
              activeOpacity={0.7}
              className="mb-3 p-3 bg-white rounded-lg border border-gray-200"
            >
              <Text className="text-xs text-gray-500 mb-1">End Date</Text>
              <Text className="text-base text-gray-800">
                {formatDisplayDate(customEndDate)}
              </Text>
            </TouchableOpacity>
            
            {/* Date Range Summary */}
            <View className="p-3 bg-[#761CBC]/10 rounded-lg">
              <Text className="text-sm text-[#761CBC] font-medium">
                {formatDisplayDate(customStartDate)} to {formatDisplayDate(customEndDate)}
              </Text>
            </View>
          </View>
        )}
        
        {/* Date Picker Modal */}
        {showCustomDatePicker && (
          <View className="mt-4 p-4 bg-white rounded-xl border border-gray-200">
            <Text className="text-sm font-medium text-gray-700 mb-3">
              {isSelectingStartDate ? 'Select Start Date' : 'Select End Date'}
            </Text>
            <DateTimePicker
              value={isSelectingStartDate ? customStartDate : customEndDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDatePickerChange}
              minimumDate={isSelectingStartDate ? new Date() : customStartDate}
            />
            {Platform.OS === 'android' && (
              <TouchableOpacity
                onPress={() => setShowCustomDatePicker(false)}
                activeOpacity={0.7}
                className="mt-3 p-2 bg-gray-200 rounded-lg"
              >
                <Text className="text-center text-gray-700">Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </FilterModal>
  );
}

