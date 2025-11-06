import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function PreviousWorkouts() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Previous Workouts</Text>
      <ScrollView style={styles.workoutList}>
        <View style={styles.workoutItem}>
          <Text style={styles.workoutDate}>November 5, 2025</Text>
          <Text style={styles.workoutType}>Upper Body Strength</Text>
          <Text style={styles.workoutDuration}>45 minutes</Text>
        </View>
        <View style={styles.workoutItem}>
          <Text style={styles.workoutDate}>November 3, 2025</Text>
          <Text style={styles.workoutType}>Cardio Session</Text>
          <Text style={styles.workoutDuration}>30 minutes</Text>
        </View>
        <View style={styles.workoutItem}>
          <Text style={styles.workoutDate}>November 1, 2025</Text>
          <Text style={styles.workoutType}>Lower Body Strength</Text>
          <Text style={styles.workoutDuration}>50 minutes</Text>
        </View>
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
  workoutItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  workoutDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  workoutType: {
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
  },
  workoutDuration: {
    fontSize: 14,
    color: '#666',
  },
});
