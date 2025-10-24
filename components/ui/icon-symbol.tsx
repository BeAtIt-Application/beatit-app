// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.left': 'chevron-left',
  'chevron.right': 'chevron-right',
  'bell': 'notifications',
  'magnifyingglass': 'search',
  'house': 'home',
  'calendar': 'event',
  'building.2': 'business',
  'person': 'person',
  'pin': 'place',
  'heart': 'favorite',
  'location': 'location-on',
  'star.fill': 'star',
  'star': 'star-border',
  'star.leadinghalf.filled': 'star-half',
  'phone': 'phone',
  'envelope': 'email',
  'xmark': 'close',
  'xmark.circle.fill': 'cancel',
  'photo': 'photo-camera',
  'person.2': 'people',
  'play.rectangle.fill': 'play-arrow',
  'music.note.list': 'queue-music',
  'waveform.path': 'graphic-eq',
  'person.circle': 'account-circle',
  'arrow.right.square': 'logout',
  'gear': 'settings',
  'pencil': 'edit',
  'globe': 'language',
  'eye': 'visibility',
  'eye.slash': 'visibility-off',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
