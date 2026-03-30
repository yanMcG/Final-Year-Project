import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { DarkModeProvider, useDarkMode } from './context/DarkModeContext';
import SideMenu from './components/SideMenu';

// Screen imports
import PreviousWorkouts from './screens/PreviousWorkoutScreen/PreviousWorkouts';
import StartWorkout from './screens/startWorkoutScreen/StartWorkout';
import GymBuddy from './screens/gymbuddyScreen/GymBuddy';
import WorkoutInProgress from './screens/startWorkoutScreen/wokroutInProgress/WorkoutInProgress';
import ViewPreviousWorkout from './screens/PreviousWorkoutScreen/ViewWorkout/ViewPreviousWorkout';
import SettingsScreen from './screens/settingsScreen/SettingsScreen';
import ContactScreen from './screens/contactScreen/ContactScreen';

const Tab = createBottomTabNavigator();

// Icon + label config for the three visible tabs
const TAB_CONFIG = {
  'Previous Workouts': { active: 'home',                inactive: 'home-outline',                label: 'Home' },
  'Start Workout':     { active: 'barbell',             inactive: 'barbell-outline',             label: 'Routines' },
  'GYM Buddy':         { active: 'chatbubble-ellipses', inactive: 'chatbubble-ellipses-outline', label: 'Chat' },
};

// Custom tab bar — width:'100%' + flex:1 per item ensures perfectly even
// distribution across the entire screen width on all device and desktop sizes.
function CustomTabBar({ state, navigation: nav, colors }) {
  const visibleRoutes = state.routes.filter((r) => TAB_CONFIG[r.name]);

  return (
    <View style={[tabStyles.tabBar, { backgroundColor: colors.tabBar, borderTopColor: colors.border }]}>
      {visibleRoutes.map((route) => {
        const isFocused = state.routes[state.index]?.name === route.name;
        const tint = isFocused ? colors.tabBarActive : colors.tabBarInactive;
        const cfg = TAB_CONFIG[route.name];

        return (
          <TouchableOpacity
            key={route.key}
            style={tabStyles.tabItem}
            onPress={() => nav.navigate(route.name)}
            activeOpacity={0.7}
          >
            <Ionicons name={isFocused ? cfg.active : cfg.inactive} size={24} color={tint} />
            <Text style={[tabStyles.label, { color: tint }]}>{cfg.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function AppContent() {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigationRef = useNavigationContainerRef();
  const { colors, isDarkMode } = useDarkMode();

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef}>
        <Tab.Navigator
          screenOptions={{ headerShown: false }}
          tabBar={(props) => <CustomTabBar {...props} colors={colors} />}
        >
          {/* Visible tabs — openMenu passes hamburger control to each screen's own header */}
          <Tab.Screen name="Previous Workouts">
            {(props) => <PreviousWorkouts {...props} openMenu={() => setMenuVisible(true)} />}
          </Tab.Screen>
          <Tab.Screen name="Start Workout">
            {(props) => <StartWorkout {...props} openMenu={() => setMenuVisible(true)} />}
          </Tab.Screen>
          <Tab.Screen name="GYM Buddy">
            {(props) => <GymBuddy {...props} openMenu={() => setMenuVisible(true)} />}
          </Tab.Screen>

          {/* Hidden screens — no tab bar button */}
          <Tab.Screen name="WorkoutInProgress"   component={WorkoutInProgress}   options={{ tabBarButton: () => null }} />
          <Tab.Screen name="ViewPreviousWorkout" component={ViewPreviousWorkout} options={{ tabBarButton: () => null }} />
          <Tab.Screen name="Settings"            component={SettingsScreen}      options={{ tabBarButton: () => null }} />
          <Tab.Screen name="Contact"             component={ContactScreen}       options={{ tabBarButton: () => null }} />
        </Tab.Navigator>
      </NavigationContainer>

      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        navigation={navigationRef}
      />

      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </View>
  );
}

export default function App() {
  return (
    <DarkModeProvider>
      <AppContent />
    </DarkModeProvider>
  );
}

const tabStyles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    width: '100%',           // ensures full-width on desktop/web
    height: 60,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabItem: {
    flex: 1,                 // each item takes an equal share of the full width
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 3,
  },
});
