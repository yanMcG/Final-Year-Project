import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import globalStyles from '../../globalStyles';
import { collection, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { Ionicons } from '@expo/vector-icons';
import styles from './previousWorkoutStyles';

export default function PreviousWorkouts({ navigation }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real-time Firestore listener for workouts
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, 'workouts'), (snapshot) => {
      const workoutsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort by date, newest first
      workoutsData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setWorkouts(workoutsData);
      setLoading(false);
    }, (err) => {
      setError('Failed to load workouts.');
      setLoading(false);
      console.error(err);
    });
    return unsubscribe;
  }, []);

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
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={globalStyles.container}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      {/* Gradient Header */}
      <View style={styles.gradientHeader}>
        <Text style={styles.headerText}>Home</Text>
      </View>
      {/* Section Title */}
      <Text style={styles.sectionTitle}>Previous workouts</Text>
      <View style={styles.sectionUnderline} />
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
        {workouts.length === 0 ? (
          <Text style={{ marginTop: 40 }}>No workouts found.</Text>
        ) : (
          workouts.map((workout) => {
            // Format date
            let formattedDate = 'No date';
            if (workout.date) {
              const d = new Date(workout.date);
              formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            }
            // Format duration
            let formattedDuration = 'No duration';
            if (typeof workout.duration === 'number') {
              const h = Math.floor(workout.duration / 3600);
              const min = Math.floor((workout.duration % 3600) / 60);
              if (h > 0) {
                formattedDuration = `${h}h ${min}min`;
              } else {
                formattedDuration = `${min}min`;
              }
            }
            return (
              <View key={workout.id} style={styles.card}>
                <Text style={styles.cardTitle}>{workout.workoutTitle || 'No title'}</Text>
                <View style={styles.cardDivider} />
                <View style={styles.rowBetween}>
                  <View style={styles.pill}><Text style={styles.pillLabel}>Date</Text><Text style={styles.pillValue}>{formattedDate}</Text></View>
                  <View style={styles.pill}><Text style={styles.pillLabel}>Duration</Text><Text style={styles.pillValue}>{formattedDuration}</Text></View>
                </View>
                <View style={styles.cardDivider} />
                <View style={{ marginVertical: 10 }}>
                  {Array.isArray(workout.exercises) && workout.exercises.map((ex, idx) => (
                    <Text key={idx} style={styles.exerciseText}>{`${ex.sets} x ${ex.reps} ${ex.name}`}</Text>
                  ))}
                </View>
                <TouchableOpacity style={styles.viewButton} onPress={() => navigation.navigate('ViewPreviousWorkout', { workout })}>
                  <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

