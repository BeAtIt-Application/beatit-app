import { FilterModal } from "@/components/FilterModal";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useMusicGenres } from "@/src/hooks/useTaxonomies";
import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface GenreFilterProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (genres: string[]) => void;
  selectedGenres?: string[];
}

export function GenreFilter({ 
  visible, 
  onClose, 
  onSelect, 
  selectedGenres = [] 
}: GenreFilterProps) {
  const { genres, isLoading } = useMusicGenres();
  const [tempSelected, setTempSelected] = useState<string[]>(selectedGenres);
  const [searchQuery, setSearchQuery] = useState("");

  const GENRE_OPTIONS = genres && genres.length > 0 ? genres.map(genre => genre.name).sort() : [];

  useEffect(() => {
    if (visible) {
      setTempSelected(selectedGenres);
      setSearchQuery("");
    }
  }, [visible, selectedGenres]);

  const filteredGenres = GENRE_OPTIONS.filter(genre =>
    genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleGenre = (genre: string) => {
    if (tempSelected.includes(genre)) {
      setTempSelected(tempSelected.filter(g => g !== genre));
    } else {
      setTempSelected([...tempSelected, genre]);
    }
  };

  const handleApply = () => {
    onSelect(tempSelected);
    onClose();
  };

  const handleClear = () => {
    setTempSelected([]);
    setSearchQuery("");
  };

  return (
    <FilterModal
      visible={visible}
      onClose={onClose}
      title="Select Genres"
      onApply={handleApply}
      onClear={handleClear}
    >
      <View className="px-5 py-4">
        <Text className="text-sm text-gray-600 mb-3">
          Search and select music genres ({GENRE_OPTIONS.length} available)
        </Text>
        
        {/* Loading State */}
        {isLoading && (
          <View className="py-12 items-center">
            <Text className="text-gray-400 text-base">Loading genres...</Text>
          </View>
        )}

        {/* Content when loaded */}
        {!isLoading && (
          <>
            {/* Search Input */}
            <View className="bg-gray-100 rounded-xl px-4 mb-4 flex-row items-center">
              <IconSymbol name="magnifyingglass" size={20} color="#666" />
              <TextInput
                className="flex-1 ml-2 text-base py-3"
                placeholder="Search genres..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Text className="text-gray-500 text-sm">Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            {/* Selected count indicator */}
            {tempSelected.length > 0 && (
              <View className="mb-3 p-3 bg-[#761CBC]/10 rounded-xl">
                <Text className="text-sm font-semibold text-[#761CBC] p-2">
                  {tempSelected.length} genre{tempSelected.length !== 1 ? 's' : ''} selected
                </Text>
              </View>
            )}
            {/* Genre list - vertical */}
            {filteredGenres.length > 0 ? (
              <View className="gap-2">
                {filteredGenres.map((genre) => {
                  const isSelected = tempSelected.includes(genre);
                  return (
                    <TouchableOpacity
                      key={genre}
                      onPress={() => toggleGenre(genre)}
                      className={`p-4 rounded-xl border-2 flex-row justify-between items-center ${
                        isSelected 
                          ? 'bg-[#761CBC]/10 border-[#761CBC]' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <Text 
                        className={`text-base font-medium ${
                          isSelected ? 'text-[#761CBC]' : 'text-gray-800'
                        }`}
                      >
                        {genre}
                      </Text>
                      {isSelected && (
                        <View className="w-6 h-6 bg-[#761CBC] rounded-full items-center justify-center">
                          <Text className="text-white text-xs">✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <View className="py-12 items-center">
                <Text className="text-gray-400 text-base">
                  {GENRE_OPTIONS.length === 0 ? 'No genres available' : 'No genres found'}
                </Text>
                {GENRE_OPTIONS.length > 0 && (
                  <Text className="text-gray-400 text-sm mt-2">Try a different search term</Text>
                )}
              </View>
            )}

            {/* Selected genres list at bottom */}
            {tempSelected.length > 0 && (
              <View className="mt-6 p-4 bg-gray-50 rounded-xl">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Your Selection ({tempSelected.length})
                </Text>
                <View className="flex-row flex-wrap gap-1.5">
                  {tempSelected.map((genre) => (
                    <View key={genre} className="bg-[#761CBC] px-2 py-1 rounded-md">
                      <Text className="text-xs text-white">{genre}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}
      </View>
    </FilterModal>
  );
}

