import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './viewPreviousWorkoutStyles';

export default function ViewPreviousWorkout({ route, navigation }) {
  const workout = route?.params?.workout;

  if (!workout) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No workout data found.</Text>
      </View>
    );
  }

  // Format date
  let formattedDate = 'No date';
  if (workout.date) {
    const d = new Date(workout.date);
    formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // Format duration (duration is stored in seconds)
  let formattedDuration = 'No duration';
  if (typeof workout.duration === 'number') {
    const h = Math.floor(workout.duration / 3600);
    const min = Math.floor((workout.duration % 3600) / 60);
    const sec = workout.duration % 60;
    if (h > 0) {
      formattedDuration = `${h}h ${min}min`;
    } else if (min > 0) {
      formattedDuration = `${min}min ${sec}s`;
    } else {
      formattedDuration = `${sec}s`;
    }
  }

  // Calculate total sets across all exercises
  const totalSets = Array.isArray(workout.exercises)
    ? workout.exercises.reduce((sum, ex) => sum + (ex.sets || 0), 0)
    : 0;

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      {/* Dark Header with back arrow and workout title */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{workout.workoutTitle || 'Workout'}</Text>
      </View>

      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
        {/* Summary Card: Date, Duration, Total Sets */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <View style={styles.summaryLabelRow}>
              <Ionicons name="calendar-outline" size={16} color="#888" />
              <Text style={styles.summaryLabel}>Date</Text>
            </View>
            <Text style={styles.summaryValue}>{formattedDate}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <View style={styles.summaryLabelRow}>
              <Ionicons name="time-outline" size={16} color="#888" />
              <Text style={styles.summaryLabel}>Duration</Text>
            </View>
            <Text style={styles.summaryValue}>{formattedDuration}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Sets</Text>
            <Text style={styles.summaryValue}>{totalSets}</Text>
          </View>
        </View>

        {/* Exercise Cards */}
        {Array.isArray(workout.exercises) && workout.exercises.map((ex, idx) => (
          <View key={idx} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{ex.name}</Text>
            <View style={styles.exerciseDivider} />
            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Set</Text>
              <Text style={styles.tableHeader}>Weight (kg)</Text>
              <Text style={styles.tableHeader}>Reps</Text>
            </View>
            {/* Table Rows — one row per set */}
            {Array.from({ length: ex.sets || 1 }).map((_, setIdx) => (
              <View key={setIdx} style={styles.tableRow}>
                <Text style={styles.tableCell}>{setIdx + 1}</Text>
                <Text style={styles.tableCell}>{ex.weight || '-'}</Text>
                <Text style={styles.tableCell}>{ex.reps || 0}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
