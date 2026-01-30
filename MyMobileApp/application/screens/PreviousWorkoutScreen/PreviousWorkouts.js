import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import globalStyles from '../../globalStyles';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

async function getWorkouts() {
  const querySnapshot = await getDocs(collection(db, 'workouts'));
  const workouts = [];
  querySnapshot.forEach((doc) => {
    workouts.push({ id: doc.id, ...doc.data() });
  });
  return workouts;
}

export default function PreviousWorkouts() {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const data = await getWorkouts();
      setWorkouts(data);
    };

    fetchWorkouts();
  }, []);

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Previous Workouts</Text>
      <ScrollView style={styles.workoutList}>
        {workouts.map((workout) => (
          <View key={workout.id} style={styles.workoutItem}>
            <Text style={styles.workoutDate}>{workout.date}</Text>
            <Text style={styles.workoutType}>{workout.type}</Text>
            <Text style={styles.workoutDuration}>{workout.duration}</Text>
          </View>
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
