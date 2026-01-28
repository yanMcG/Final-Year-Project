import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Import our screen components
import PreviousWorkouts from './screens/PreviousWorkoutScreen/PreviousWorkouts';
import StartWorkout from './screens/startWorkoutScreen/StartWorkout';
import GymBuddy from './screens/gymbuddyScreen/GymBuddy';
import WorkoutInProgress from './screens/startWorkoutScreen/wokroutInProgress/WorkoutInProgress';

// Create the bottom tab navigator that will hold our screens
const Tab = createBottomTabNavigator();

// Main App component
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        // Define screen options for the tab navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            // Set icon based on the route name and focus state
            if (route.name === 'Previous Workouts') {
              // Use different icons for focused and unfocused states
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'Start Workout') {
              iconName = focused ? 'play-circle' : 'play-circle-outline';
            } else if (route.name === 'GYM Buddy') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            } else if (route.name === 'WorkoutInProgress') {
              // hidden screen — pick a harmless default icon
              iconName = focused ? 'ellipsis-horizontal' : 'ellipsis-horizontal-outline';
            }

            if (!iconName) iconName = 'ellipse';

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen name="Previous Workouts" component={PreviousWorkouts} />
        <Tab.Screen name="Start Workout" component={StartWorkout} />
        <Tab.Screen name="GYM Buddy" component={GymBuddy} />
        <Tab.Screen
          name="WorkoutInProgress"
          component={WorkoutInProgress}
          options={{ tabBarButton: () => null }}
        />
      </Tab.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
