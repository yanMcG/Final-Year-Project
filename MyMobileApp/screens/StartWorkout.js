import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

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
    <View style={styles.container}>
      <Text style={styles.title}>Start a Workout</Text>
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
            <View style={styles.startButton}>
              <Text style={styles.buttonText}>Start Workout</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  workoutList: {
    flex: 1,
  },
  workoutCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
  startButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
