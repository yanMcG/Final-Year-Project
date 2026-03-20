import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import globalStyles from '../../globalStyles';
import { collection, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { getReps, uploadReps, db } from '../../firebase/Firebase';


// This screen will show a list of previous workouts stored in Firestore
async function getWorkouts() {
  const querySnapshot = await getDocs(collection(db, 'workouts'));
  const workouts = [];
  querySnapshot.forEach((doc) => {
    workouts.push({ id: doc.id, ...doc.data() });
  });
  return workouts;
}


export default function PreviousWorkouts() {
  // State variables for workouts, loading state, error messages, and reps input
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentReps, setCurrentReps] = useState(0);
  const [newReps, setNewReps] = useState('');

  // Fetch current reps from Firestore on component mount
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



  // Real-time Firestore listener for workouts
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, 'workouts'), (snapshot) => {
      const workoutsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWorkouts(workoutsData);
      setLoading(false);
    }, (err) => {
      setError('Failed to load workouts.');
      setLoading(false);
      console.error(err);
    });
    return unsubscribe;
  }, []);



  // Handle form submission to update reps in Firestore
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



  // Remove all workouts from Firestore
  const handleRemoveData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'workouts'));
      const deletePromises = querySnapshot.docs.map((d) => deleteDoc(doc(db, 'workouts', d.id)));
      await Promise.all(deletePromises);
      setWorkouts([]);
      Alert.alert('Success', 'All workout data removed.');
    } catch (err) {
      setError('Failed to remove data.');
      console.error(err);
    }
  };


  
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
      {/* Remove Data Button */}
      <TouchableOpacity onPress={handleRemoveData} style={{ backgroundColor: '#ff3b30', padding: 10, borderRadius: 8, marginBottom: 10, alignSelf: 'center' }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Remove Data</Text>
      </TouchableOpacity>
      <Text style={globalStyles.title}>Previous Workouts</Text>
      {workouts.length === 0 ? (
        <Text>No workouts found.</Text>
      ) : (
        <ScrollView style={styles.workoutList}>
          {workouts.map((workout) => {
            // Format date
            let formattedDate = 'No date';
            if (workout.date) {
              const d = new Date(workout.date);
              formattedDate = d.toLocaleString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                timeZone: 'GMT',
                hour12: false
              });
            }
            // Format duration
            let formattedDuration = 'No duration';
            if (typeof workout.duration === 'number') {
              const m = Math.floor(workout.duration / 60).toString().padStart(2, '0');
              const s = (workout.duration % 60).toString().padStart(2, '0');
              formattedDuration = `${m}:${s}`;
            }
            return (
              <View key={workout.id} style={styles.workoutItem}>
                <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 4 }}>
                  {workout.workoutTitle || 'No title'}
                </Text>
                <Text style={styles.workoutDate}>{formattedDate}</Text>
                <Text style={styles.workoutDuration}>Duration: {formattedDuration}</Text>
              </View>
            );
          })}
        </ScrollView>
      )}

   
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
