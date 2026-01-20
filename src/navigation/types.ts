import type {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import type {
  BottomTabScreenProps,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';
import type {
  CompositeScreenProps,
  CompositeNavigationProp,
  NavigatorScreenParams,
} from '@react-navigation/native';

/**
 * Root stack param list - handles device selection modal
 */
export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  DeviceSelection: undefined;
};

/**
 * Main tab param list - the bottom tabs
 */
export type MainTabParamList = {
  Control: undefined;
  History: undefined;
};

/**
 * Screen props for Root stack screens
 */
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

/**
 * Screen props for Main tab screens
 */
export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

/**
 * Navigation prop for Root stack
 */
export type RootStackNavigationProp<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;

/**
 * Navigation prop for Main tab screens (can also navigate to root stack)
 */
export type MainTabNavigationProp<T extends keyof MainTabParamList> =
  CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList, T>,
    NativeStackNavigationProp<RootStackParamList>
  >;

// Declare global types for navigation
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
