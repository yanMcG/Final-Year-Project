import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import globalStyles from '../../globalStyles';
import { collection, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { Ionicons } from '@expo/vector-icons';
import styles from './previousWorkoutStyles';
import { useDarkMode } from '../../context/DarkModeContext';

export default function PreviousWorkouts({ navigation, openMenu }) {
  const { colors, isDarkMode } = useDarkMode();
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

  if (loading) {
    return (
      <View style={[globalStyles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[globalStyles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header with hamburger */}
      <View style={[styles.gradientHeader, { backgroundColor: colors.header }]}>
        {openMenu && (
          <TouchableOpacity style={{ position: 'absolute', left: 18, top: 50, zIndex: 10 }} onPress={openMenu}>
            <Ionicons name="menu" size={26} color="#fff" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerText}>Home</Text>
      </View>
      {/* Section Title */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Previous workouts</Text>
      <View style={[styles.sectionUnderline, { backgroundColor: colors.border }]} />
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
        {workouts.length === 0 ? (
          <Text style={{ marginTop: 40, color: colors.subText }}>No workouts found.</Text>
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
              <View key={workout.id} style={[styles.card, { backgroundColor: colors.card }]}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{workout.workoutTitle || 'No title'}</Text>
                <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />
                <View style={styles.rowBetween}>
                  <View style={[styles.pill, { backgroundColor: colors.inputBg }]}>
                    <Text style={[styles.pillLabel, { color: colors.subText }]}>Date</Text>
                    <Text style={[styles.pillValue, { color: colors.text }]}>{formattedDate}</Text>
                  </View>
                  <View style={[styles.pill, { backgroundColor: colors.inputBg }]}>
                    <Text style={[styles.pillLabel, { color: colors.subText }]}>Duration</Text>
                    <Text style={[styles.pillValue, { color: colors.text }]}>{formattedDuration}</Text>
                  </View>
                </View>
                <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />
                <View style={{ marginVertical: 10 }}>
                  {Array.isArray(workout.exercises) && workout.exercises.map((ex, idx) => (
                    <Text key={idx} style={[styles.exerciseText, { color: colors.text }]}>{`${ex.sets} x ${ex.reps} ${ex.name}`}</Text>
                  ))}
                </View>
                <TouchableOpacity style={[styles.viewButton, { backgroundColor: isDarkMode ? '#fff' : '#232526' }]} onPress={() => navigation.navigate('ViewPreviousWorkout', { workout })}>
                  <Text style={[styles.viewButtonText, { color: isDarkMode ? '#232526' : '#fff' }]}>View</Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

