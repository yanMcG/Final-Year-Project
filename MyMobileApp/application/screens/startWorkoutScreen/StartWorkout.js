import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import globalStyles from '../../globalStyles';

export default function StartWorkout({ navigation }) {
  const workoutTypes = [
    { id: 1, name: 'Full Body', duration: '30 min', exercises: 3},
  ];

  const startWorkout = (workout) => {
    const exercises = [
      { id: 1, name: 'Barbell Bench Press', sets: 1 },
      { id: 2, name: 'Barbell Squat', sets: 1 },
      { id: 3, name: 'Pull Up', sets: 1 },
    ];

    navigation.navigate('WorkoutInProgress', { workout, exercises });
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Start a Workout</Text>
      <ScrollView style={styles.workoutList}>
        {workoutTypes.map((workout) => (
          <TouchableOpacity
            key={workout.id}
            style={styles.workoutCard}
            onPress={() => startWorkout(workout)}
          >
            <Text style={styles.workoutName}>{workout.name}</Text>
            <Text style={styles.workoutInfo}>Duration: {workout.duration}</Text>
            <Text style={styles.workoutInfo}>Exercises: {workout.exercises}</Text>
            <View style={globalStyles.button}>
              <Text style={globalStyles.buttonText}>Start Workout</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  workoutList: {
    flex: 1,
  },
  workoutCard: {
    ...globalStyles.card,
    padding: 20,
    borderRadius: 15,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  workoutInfo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
});
