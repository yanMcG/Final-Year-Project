import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import globalStyles from '../../globalStyles';
import { collection, getDocs } from 'firebase/firestore';
import { getReps, uploadReps } from '../../firebase/Firebase';
import { db } from '../../firebase/Firebase';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentReps, setCurrentReps] = useState(0);
  const [newReps, setNewReps] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        let result = await getReps();
        setCurrentReps(result);
      } catch (err) {
        setError('Failed to load reps.');
        console.error(err);
      }
    };
    getData();
  }, []);

  const handleFormSubmission = async () => {
    try {
      await uploadReps(newReps);
      setCurrentReps(newReps);
      setNewReps('');
    } catch (err) {
      setError('Failed to update reps.');
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await getWorkouts();
        setWorkouts(data);
      } catch (err) {
        setError('Failed to load workouts.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, []);

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Previous Workouts</Text>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Previous Workouts</Text>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Previous Workouts</Text>
      {workouts.length === 0 ? (
        <Text>No workouts found.</Text>
      ) : (
        <ScrollView style={styles.workoutList}>
          {workouts.map((workout) => (
            <View key={workout.id} style={styles.workoutItem}>
              <Text style={styles.workoutDate}>{workout.date || 'No date'}</Text>
              <Text style={styles.workoutType}>{workout.type || 'No type'}</Text>
              <Text style={styles.workoutDuration}>{workout.duration || 'No duration'}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Display and update current reps */}
      <View style={{ marginTop: 20, padding: 10, backgroundColor: '#f2f2f2', borderRadius: 8 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Current reps: {currentReps}</Text>
        <TextInput
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8, marginBottom: 8 }}
          keyboardType="numeric"
          value={newReps}
          onChangeText={setNewReps}
          placeholder="Enter new reps"
        />
        <TouchableOpacity
          style={{ backgroundColor: '#007AFF', padding: 10, borderRadius: 5, alignItems: 'center' }}
          onPress={handleFormSubmission}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Update Reps</Text>
        </TouchableOpacity>
      </View>
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
