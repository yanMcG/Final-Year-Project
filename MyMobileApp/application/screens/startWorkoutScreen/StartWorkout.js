import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import styles from './startWorkoutStyles';
import { useDarkMode } from '../../context/DarkModeContext';

// Predefined workout routines
const workoutTypes = [
  {
    id: 1,
    name: 'Full Body',
    exercises: [
      { id: 1, name: 'Flat Barbell Bench Press', sets: 3 },
      { id: 2, name: 'Smith Machine Squat', sets: 3 },
      { id: 3, name: 'Barbell Deadlift', sets: 3 },
    ],
  },
];

export default function StartWorkout({ navigation }) {
  const { colors, isDarkMode } = useDarkMode();

  const startWorkout = (workout) => {
    navigation.navigate('WorkoutInProgress', { workout, exercises: workout.exercises });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Dark "Routines" Header */}
      <View style={[styles.header, { backgroundColor: colors.header }]}>
        <Text style={styles.headerText}>Routines</Text>
      </View>

      <ScrollView style={styles.workoutList} contentContainerStyle={{ paddingBottom: 40 }}>
        {workoutTypes.map((workout) => (
          <View key={workout.id} style={[styles.workoutCard, { backgroundColor: colors.card }]}>
            {/* Workout title */}
            <Text style={[styles.workoutName, { color: colors.text }]}>{workout.name}</Text>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Exercise list */}
            {workout.exercises.map((ex) => (
              <Text
                key={ex.id}
                style={[styles.exerciseItem, { color: colors.text }]}
              >
                {ex.name}
              </Text>
            ))}

            {/* Start Button */}
            <TouchableOpacity
              style={[styles.startButton, { backgroundColor: isDarkMode ? '#fff' : '#1a1a1a' }]}
              onPress={() => startWorkout(workout)}
              activeOpacity={0.85}
            >
              <Text style={[styles.startButtonText, { color: isDarkMode ? '#1a1a1a' : '#fff' }]}>
                Start
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
