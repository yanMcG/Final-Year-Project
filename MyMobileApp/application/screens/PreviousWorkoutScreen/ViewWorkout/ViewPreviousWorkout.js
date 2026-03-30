import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './viewPreviousWorkoutStyles';
import { useDarkMode } from '../../../context/DarkModeContext';

export default function ViewPreviousWorkout({ route, navigation }) {
  const { colors } = useDarkMode();
  const workout = route?.params?.workout;

  if (!workout) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.text }}>No workout data found.</Text>
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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Dark Header with back arrow and workout title */}
      <View style={[styles.header, { backgroundColor: colors.header }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{workout.workoutTitle || 'Workout'}</Text>
      </View>

      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
        {/* Summary Card: Date, Duration, Total Sets */}
        <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
          <View style={styles.summaryItem}>
            <View style={styles.summaryLabelRow}>
              <Ionicons name="calendar-outline" size={16} color={colors.subText} />
              <Text style={[styles.summaryLabel, { color: colors.subText }]}>Date</Text>
            </View>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{formattedDate}</Text>
          </View>
          <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
          <View style={styles.summaryItem}>
            <View style={styles.summaryLabelRow}>
              <Ionicons name="time-outline" size={16} color={colors.subText} />
              <Text style={[styles.summaryLabel, { color: colors.subText }]}>Duration</Text>
            </View>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{formattedDuration}</Text>
          </View>
          <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.subText }]}>Total Sets</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{totalSets}</Text>
          </View>
        </View>

        {/* Exercise Cards */}
        {Array.isArray(workout.exercises) && workout.exercises.map((ex, idx) => (
          <View key={idx} style={[styles.exerciseCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.exerciseName, { color: colors.text }]}>{ex.name}</Text>
            <View style={[styles.exerciseDivider, { backgroundColor: colors.border }]} />
            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableHeader, { color: colors.subText }]}>Set</Text>
              <Text style={[styles.tableHeader, { color: colors.subText }]}>Weight (kg)</Text>
              <Text style={[styles.tableHeader, { color: colors.subText }]}>Reps</Text>
            </View>
            {/* Table Rows — one row per set */}
            {Array.from({ length: ex.sets || 1 }).map((_, setIdx) => (
              <View key={setIdx} style={styles.tableRow}>
                <Text style={[styles.tableCell, { color: colors.text }]}>{setIdx + 1}</Text>
                <Text style={[styles.tableCell, { color: colors.text }]}>{ex.weight || '-'}</Text>
                <Text style={[styles.tableCell, { color: colors.text }]}>{ex.reps || 0}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
