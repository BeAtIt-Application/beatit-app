import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from './ui/icon-symbol';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  size?: number;
  showText?: boolean;
  disabled?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  interactive = false,
  size = 20,
  showText = false,
  disabled = false,
}) => {
  const handleStarPress = (starRating: number) => {
    if (interactive && onRatingChange && !disabled) {
      onRatingChange(starRating);
    }
  };

  const renderStar = (index: number) => {
    const starRating = index + 1;
    const isFilled = starRating <= rating;

    return (
      <TouchableOpacity
        key={index}
        onPress={() => handleStarPress(starRating)}
        disabled={!interactive || disabled}
        activeOpacity={interactive ? 0.7 : 1}
        className="mr-1"
      >
        <IconSymbol
          name={isFilled ? "star.fill" : "star"}
          size={size}
          color={isFilled ? "#FFD700" : "#D1D5DB"}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-row items-center">
      <View className="flex-row">
        {Array.from({ length: 5 }, (_, index) => renderStar(index))}
      </View>
      {showText && (
        <Text className="ml-2 text-gray-600 text-sm">
          {rating.toFixed(1)}
        </Text>
      )}
    </View>
  );
};