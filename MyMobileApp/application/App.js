import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import globalStyles from './globalStyles';
import { DarkModeProvider, useDarkMode } from './context/DarkModeContext';
import SideMenu from './components/SideMenu';

// Import our screen components
import PreviousWorkouts from './screens/PreviousWorkoutScreen/PreviousWorkouts';
import StartWorkout from './screens/startWorkoutScreen/StartWorkout';
import GymBuddy from './screens/gymbuddyScreen/GymBuddy';
import WorkoutInProgress from './screens/startWorkoutScreen/wokroutInProgress/WorkoutInProgress';
import ViewPreviousWorkout from './screens/PreviousWorkoutScreen/ViewWorkout/ViewPreviousWorkout';
import SettingsScreen from './screens/settingsScreen/SettingsScreen';
import ContactScreen from './screens/contactScreen/ContactScreen';

// Create the bottom tab navigator that will hold our screens
const Tab = createBottomTabNavigator();

function AppContent() {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigationRef = useNavigationContainerRef();
  const { colors, isDarkMode } = useDarkMode();

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Previous Workouts') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Start Workout') {
                iconName = focused ? 'play-circle' : 'play-circle-outline';
              } else if (route.name === 'GYM Buddy') {
                iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              }
              if (!iconName) iconName = 'ellipse';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: colors.tabBarActive,
            tabBarInactiveTintColor: colors.tabBarInactive,
            tabBarStyle: { backgroundColor: colors.tabBar },
            headerStyle: { backgroundColor: colors.header },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
            headerLeft: () => (
              <TouchableOpacity
                style={{ marginLeft: 16 }}
                onPress={() => setMenuVisible(true)}
              >
                <Ionicons name="menu" size={26} color="#fff" />
              </TouchableOpacity>
            ),
          })}
        >
          <Tab.Screen
            name="Previous Workouts"
            options={{ headerShown: false }}
          >
            {(props) => <PreviousWorkouts {...props} openMenu={() => setMenuVisible(true)} />}
          </Tab.Screen>
          <Tab.Screen name="Start Workout" component={StartWorkout} />
          <Tab.Screen name="GYM Buddy" component={GymBuddy} />
          <Tab.Screen
            name="WorkoutInProgress"
            component={WorkoutInProgress}
            options={{ tabBarButton: () => null, headerShown: false }}
          />
          <Tab.Screen
            name="ViewPreviousWorkout"
            component={ViewPreviousWorkout}
            options={{ tabBarButton: () => null, headerShown: false }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ tabBarButton: () => null, headerShown: false }}
          />
          <Tab.Screen
            name="Contact"
            component={ContactScreen}
            options={{ tabBarButton: () => null, headerShown: false }}
          />
        </Tab.Navigator>
      </NavigationContainer>

      {/* Side Menu Overlay */}
      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        navigation={navigationRef}
      />

      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </View>
  );
}

// Main App component
export default function App() {
  return (
    <DarkModeProvider>
      <AppContent />
    </DarkModeProvider>
  );
}
