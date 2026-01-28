import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import globalStyles from '../../globalStyles';

export default function PreviousWorkouts() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Previous Workouts</Text>
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

import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  workoutList: {
    flex: 1,
  },
  workoutItem: {
    ...globalStyles.card,
    padding: 15,
    borderRadius: 10,
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
