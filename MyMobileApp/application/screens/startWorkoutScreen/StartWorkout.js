import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import globalStyles from '../../globalStyles';
import styles from './startWorkoutStyles';
import { useDarkMode } from '../../context/DarkModeContext';

// This screen will show a the wokrout routine predefined
export default function StartWorkout({ navigation }) {
  const { colors, isDarkMode } = useDarkMode();

  const workoutTypes = [
    { id: 1, name: 'Full Body', duration: '30 min', exercises: 3},
  ];


// When user clicks on a workout type, we navigate to the WorkoutInProgress screen and pass the workout
  const startWorkout = (workout) => {
    const exercises = [
      { id: 1, name: 'Barbell Bench Press', sets: 1 },
      { id: 2, name: 'Barbell Squat', sets: 1 },
      { id: 3, name: 'Pull Up', sets: 1 },
    ];
    navigation.navigate('WorkoutInProgress', { workout, exercises });
  };

  // This screen will show a list of workout types (e.g., Full Body, Upper Body, etc.)
  return (
    <View style={[globalStyles.container, { backgroundColor: colors.background }]}>
      <Text style={[globalStyles.title, { color: colors.text }]}>Start a Workout</Text>
      <ScrollView style={styles.workoutList}>
        {workoutTypes.map((workout) => (
          <TouchableOpacity
            key={workout.id}
            style={[styles.workoutCard, { backgroundColor: colors.card }]}
            onPress={() => startWorkout(workout)}
          >
            <Text style={[styles.workoutName, { color: colors.text }]}>{workout.name}</Text>
            <Text style={[styles.workoutInfo, { color: colors.subText }]}>Duration: {workout.duration}</Text>
            <Text style={[styles.workoutInfo, { color: colors.subText }]}>Exercises: {workout.exercises}</Text>
            <View style={[globalStyles.button, { backgroundColor: isDarkMode ? '#fff' : '#111' }]}>
              <Text style={[globalStyles.buttonText, { color: isDarkMode ? '#111' : '#fff' }]}>Start Workout</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
