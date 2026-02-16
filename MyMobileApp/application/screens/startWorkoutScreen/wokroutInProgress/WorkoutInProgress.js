import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import styles from './wokroutInProgressStyles';

let useSQLite = Platform.OS !== 'web';
let SQLite, db;
if (useSQLite) {
  SQLite = require('expo-sqlite');
  db = SQLite.openDatabase('workouts.db');
}

export default function WorkoutInProgress({ route, navigation }) {
  const defaultExercises = [
    { id: 1, name: 'Barbell Bench Press', sets: 1 },
    { id: 2, name: 'Barbell Squat', sets: 1 },
    { id: 3, name: 'Pull Up', sets: 1 },
  ];

  const exercises = route?.params?.exercises ?? defaultExercises;

  const initialReps = exercises.reduce((acc, ex) => {
    acc[ex.id] = '';
    return acc;
  }, {});

  const [reps, setReps] = useState(initialReps);

  const handleChange = (id, value) => {
    // allow only numbers
    const sanitized = value.replace(/[^0-9]/g, '');
    setReps((prev) => ({ ...prev, [id]: sanitized }));
  };

  const handleEndWorkout = async () => {
    const results = exercises.map((ex) => ({
      id: ex.id,
      name: ex.name,
      sets: ex.sets,
      reps: reps[ex.id] === '' ? 0 : parseInt(reps[ex.id], 10),
    }));

    // simple validation: at least one rep entered
    const anyEntered = results.some((r) => r.reps > 0);
    if (!anyEntered) {
      Alert.alert('No reps entered', 'Please enter reps for at least one exercise or press End Workout to cancel.');
      return;
    }

    // Save workout to SQLite database (if not web)
    if (useSQLite) {
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10);
      const duration = 'N/A'; // You can calculate duration if you track start/end time
      db.transaction(
        tx => {
          tx.executeSql(
            'INSERT INTO workouts (date, type, duration) VALUES (?, ?, ?);',
            [dateStr, 'Full Body', duration],
            (_, result) => {
              const workoutId = result.insertId;
              let completed = 0;
              results.forEach((ex, idx) => {
                tx.executeSql(
                  'INSERT INTO exercises (workout_id, name, sets, reps) VALUES (?, ?, ?, ?);',
                  [workoutId, ex.name, ex.sets, ex.reps],
                  () => {
                    completed++;
                    if (completed === results.length) {
                      // All exercises inserted, show alert and navigate
                      const summary = results.map((r) => `${r.name}: ${r.reps} reps`).join('\n');
                      Alert.alert('Workout Results', summary, [
                        { text: 'OK', onPress: () => navigation.navigate('Previous Workouts') },
                      ]);
                    }
                  }
                );
              });
            }
          );
        },
        error => {
          Alert.alert('Error', 'Failed to save workout.');
        }
      );
      return; // Prevent double alert
    }

    // For web: just show a summary alert and go back
    const summary = results.map((r) => `${r.name}: ${r.reps} reps`).join('\n');
    Alert.alert('Workout Results', summary, [
      { text: 'OK', onPress: () => navigation.navigate('Previous Workouts') },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout In Progress</Text>
      <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 40 }}>
        {exercises.map((ex) => (
          <View key={ex.id} style={styles.card}>
            <Text style={styles.exerciseName}>{ex.name}</Text>
            <Text style={styles.exerciseInfo}>Sets: {ex.sets}</Text>
            <View style={styles.inputRow}>
              <Text style={styles.label}>Reps completed</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={reps[ex.id]}
                onChangeText={(text) => handleChange(ex.id, text)}
                placeholder="0"
                maxLength={3}
              />
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.endButton} onPress={handleEndWorkout}>
          <Text style={styles.endButtonText}>Save & End Workout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}