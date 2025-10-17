import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export interface CategoryItem {
  id: string | number;
  label: string;
  value: string;
  filter?: Record<string, any>;
}

interface CategoryGridProps {
  title: string;
  items: CategoryItem[];
  onItemPress?: (item: CategoryItem) => void;
  columns?: number;
  showTitle?: boolean;
}

export function CategoryGrid({
  title,
  items,
  onItemPress,
  columns = 2,
  showTitle = true,
}: CategoryGridProps) {
  const renderItems = () => {
    const rows = [];
    for (let i = 0; i < items.length; i += columns) {
      const rowItems = items.slice(i, i + columns);
      rows.push(
        <View key={i} className="flex-row gap-3 mb-3">
          {rowItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="flex-1 bg-gray-100 px-5 py-3 rounded-full items-center bg-white"
              onPress={() => onItemPress?.(item)}
            >
              <Text className="text-sm text-gray-600 font-medium">
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
          {/* Fill remaining space if last row is incomplete */}
          {rowItems.length < columns &&
            Array.from({ length: columns - rowItems.length }).map((_, idx) => (
              <View key={`empty-${idx}`} className="flex-1" />
            ))}
        </View>
      );
    }
    return rows;
  };

  return (
    <View className="px-5 pb-8">
      {showTitle && (
        <Text className="text-xl font-bold text-center text-[#1A1A2E] mb-4">{title}</Text>
      )}
      <View>{renderItems()}</View>
    </View>
  );
}

